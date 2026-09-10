const { Op } = require("sequelize");
const { Booking, BookingSeat, sequelize,} = require("../../models");
const catalogClient = require("../grpc/cataloggrpcClient")
const paymentClient = require("../grpc/paymentgrpcClient")
const { errorMessages } = require("@movie/common").constants;
const { AppError } = require("@movie/common").errors;
const { logger } = require("@movie/common");
const { publishBookingEvent } = require("../kafka/producer");

const createBooking = async (req, res) => {
    const { showtimeId, seatIds } = req.body;
    const userId = req.user.id;
    const requestId = req.requestId;

    const showtime = await catalogClient.getShowtime(showtimeId, requestId);
    if (!showtime) {
        logger.warn("Booking failed: showtime not found", { requestId, userId, showtimeId, });
        throw new AppError(errorMessages.SHOWTIME.NOT_FOUND, 404);
    }

    const seats = await catalogClient.getTheaterSeats(showtime.theaterId, requestId);
    const selectedSeats = seats.filter((seat) => seatIds.includes(seat.id) );

    if (selectedSeats.length !== seatIds.length) {
        logger.warn("Booking failed: invalid seat selection", {
            requestId,
            userId,
            showtimeId,
            seatIds,
        });
        throw new AppError(errorMessages.SEAT.NOT_FOUND, 400);
    }

    const alreadyBooked = await BookingSeat.findAll({
        include: [{
                model: Booking,
                where: { showtimeId, status: { [Op.ne]: "cancelled" } },
                attributes: [],
            },
        ],
        where: { seatId: { [Op.in]: seatIds } },
    });

    if (alreadyBooked.length > 0) {
        logger.warn("Booking failed: seats already booked", {
            requestId,
            userId,
            showtimeId,
            requestedSeats: seatIds,
            bookedSeats: alreadyBooked.map(seat => seat.seatId),
        });
        throw new AppError(errorMessages.SEAT.ALREADY_BOOKED, 409);
    }

    const totalPrice = Number(showtime.price) * seatIds.length;

    let booking;
    try {
        booking = await sequelize.transaction(async (transaction) => {
            const newBooking = await Booking.create({
                    userId: req.user.id,
                    showtimeId,
                    totalPrice,
                    status: "pending",
                }, { transaction });

            await BookingSeat.bulkCreate(
                seatIds.map((seatId) => ({
                    bookingId: newBooking.id,
                    seatId,
                })), { transaction }
            );
            return newBooking;
        });
        logger.info("Booking created", {
            requestId,
            bookingId: booking.id,
            userId,
            showtimeId,
            seatIds,
            totalPrice,
        });
    } catch (err) {
        logger.error("Booking transaction failed", {
            requestId,
            userId,
            showtimeId,
            error: err.message,
        });
        throw new AppError(errorMessages.SEAT.ALREADY_BOOKED, 409)
    }

    let payment;
    try {
        payment = await paymentClient.chargeUser({
            userId,
            bookingId: booking.id,
            amount: totalPrice,
            description: `Payment for booking #${booking.id}`,
        }, requestId);
    } catch (err) {
        logger.error("Payment failed", {
            requestId,
            userId,
            bookingId: booking.id,
            amount: totalPrice,
            error: err.message,
        });
        await booking.update({ status: "cancelled"});
        return res.status(err.status || 502).json({ message: err.message });
    }

    try {
        await booking.update({ status: "confirmed" });
        logger.info("Booking confirmed", {
            requestId,
            userId,
            bookingId: booking.id,
        }); 
    } catch (err) {
        logger.error("Booking confirmation failed. Initiating refund.", {
            requestId,
            userId,
            bookingId: booking.id,
            error: err.message,
        });
        await paymentClient.refundUser({
            userId,
            bookingId: booking.id,
            amount: totalPrice,
            description: `Compensation refund for booking #${booking.id}`
        }, requestId);
        throw err;
    }
    
    await publishBookingEvent('booking.confirmed', {
        bookingId: booking.id,
        userId: booking.userId,
        showtimeId,
        seats: seatIds,
        totalPrice,
    }, requestId);

    res.status(201).json({
        message: "Booking created successfully.",
        booking: {
            id: booking.id,
            userId: booking.userId,
            showtimeId,
            totalPrice,
            status: "confirmed",
            seats: selectedSeats,
        },
        amountDeducted: totalPrice,
        remainingBalance: payment.balanceAfter,
    });
};

const getAllBookings = async (req, res) => {
    const bookings = await Booking.findAll({
        include: [{
                model: BookingSeat,
                attributes: [ "seatId"],
            },
        ],
    });
    
    logger.info("Retrieved all bookings", {
        requestId: req.requestId,
        count: bookings.length,
    });

    res.status(200).json(bookings);
};

const getMyBookings = async (req, res) => {
    const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: [ {
                model: BookingSeat,
                attributes: [ "seatId" ],
            },
        ],
    });
    
    logger.info("Retrieved user bookings", {
        userId: req.user.id,
        count: bookings.length,
    });

    res.status(200).json(bookings);
};

const cancelBooking = async (req, res) => {
    const requestId = req.requestId;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
        logger.warn("Booking cancellation failed: booking not found", {
            requestId,
            bookingId: req.params.id,
            userId: req.user.id,
        });

        throw new AppError(errorMessages.BOOKING.NOT_FOUND, 404);
    }

    if (booking.userId !== req.user.id) {
        logger.warn("Unauthorized booking cancellation attempt", {
            requestId,
            bookingId: booking.id,
            userId: req.user.id,
        });

        throw new AppError(errorMessages.USER.UNAUTHORIZED, 403);
    }

    if (booking.status === "cancelled") {
        logger.warn("Booking already cancelled", {
            requestId,
            bookingId: booking.id,
            userId: req.user.id,
        });

        throw new AppError(errorMessages.BOOKING.ALREADY_CANCELLED, 400);
    }

    logger.info("Starting booking cancellation", {
        requestId,
        bookingId: booking.id,
        userId: req.user.id,
        amount: booking.totalPrice,
        status: booking.status,
    });


    let refund;
    try{
        refund = await paymentClient.refundUser({
            userId: req.user.id,
            bookingId: booking.id,
            amount: booking.totalPrice,
            description: `Refund for booking #${booking.id}`,
        }, requestId);

        logger.info("Refund successful", {
            requestId,
            bookingId: booking.id,
            userId: req.user.id,
            refundedAmount: booking.totalPrice,
            remainingBalance: refund.balanceAfter,
        });
    } catch(err) {
        logger.error("Refund failed", {
            requestId,  
            bookingId: booking.id,
            userId: req.user.id,
            amount: booking.totalPrice,
            error: err.message,
        })

        throw err;
    }
    
    try {
        await booking.update({ status: "cancelled" });

        logger.info("Booking cancelled successfully", {
            requestId,
            bookingId: booking.id,
            userId: req.user.id,
            refundedAmount: booking.totalPrice,
        });
    } catch (err) {
        logger.error("Booking status update failed after refund", {
            requestId,
            bookingId: booking.id,
            userId: req.user.id,
            refundedAmount: booking.totalPrice,
            error: err.message,
        });

        throw err;
    }

    await publishBookingEvent('booking.cancelled', {
        bookingId: booking.id,
        userId: booking.userId,
        refundedAmount: booking.totalPrice,
    }, requestId);

    res.status(200).json({
        message: "Booking cancelled successfully.",
        refundedAmount: booking.totalPrice,
        remainingBalance: refund.balanceAfter,
    });
};
module.exports = { createBooking, getAllBookings, getMyBookings,cancelBooking };