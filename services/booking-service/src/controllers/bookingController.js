const { Op } = require("sequelize");
const { Booking, BookingSeat, sequelize,} = require("../../models");
const catalogClient = require("../utils/catalogClient");
const paymentClient = require("../utils/paymentClient");

const { sendNotification } = require("@movie/common").utils;
const { errorMessages } = require("@movie/common").constants;
const { AppError } = require("@movie/common").errors;
const { logger } = require("@movie/common").logger;

const createBooking = async (req, res) => {

    const { showtimeId, seatIds } = req.body;

    const showtime = await catalogClient.getShowtime(showtimeId);
    if (!showtime) {
        logger.warn("Booking failed: showtime not found", {
            userId: req.user.id,
            showtimeId,
        });
        throw new AppError(errorMessages.SHOWTIME.NOT_FOUND, 404);
    }

    const seats = await catalogClient.getTheaterSeats(showtime.theaterId);

    const selectedSeats = seats.filter((seat) =>
        seatIds.includes(seat.id)
    );

    if (selectedSeats.length !== seatIds.length) {
        logger.warn("Booking failed: invalid seat selection", {
            userId: req.user.id,
            showtimeId,
            seatIds,
        });

        throw new AppError(errorMessages.SEAT.NOT_FOUND, 400);
    }

    const alreadyBooked = await BookingSeat.findAll({
        include: [{
                model: Booking,
                where: {
                    showtimeId,
                    status: { [Op.ne]: "cancelled" },
                },
                attributes: [],
            },
        ],
        where: {
            seatId: { [Op.in]: seatIds },
        },
    });

    if (alreadyBooked.length > 0) {
        logger.warn("Booking failed: seats already booked", {
            userId: req.user.id,
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
            bookingId: booking.id,
            userId: req.user.id,
            showtimeId,
            seatIds,
            totalPrice,
        });
    } catch (err) {
        logger.error("Booking transaction failed", {
            userId: req.user.id,
            showtimeId,
            error: err.message,
        });

        throw new AppError(errorMessages.SEAT.ALREADY_BOOKED, 409)
    }

    let payment;
    try {
        payment = await paymentClient.chargeUser({
            userId: req.user.id,
            bookingId: booking.id,
            amount: totalPrice,
            description: `Payment for booking #${booking.id}`,
        });

    } catch (err) {
        logger.error("Payment failed", {
            bookingId: booking.id,
            userId: req.user.id,
            amount: totalPrice,
            error: err.message,
        });

        await booking.update({ status: "cancelled"});
        return res.status(err.status || 502).json({ message: err.message });
    }

    try {
        await booking.update({ status: "confirmed" });

        logger.info("Booking confirmed", {
            bookingId: booking.id,
            userId: req.user.id,
        }); 
    } catch (err) {
        logger.error("Booking confirmation failed. Initiating refund.", {
            bookingId: booking.id,
            userId: req.user.id,
            error: err.message,
        });

        await paymentClient.refundUser({
            userId: req.user.id,
            bookingId: booking.id,
            amount: totalPrice,
            description: `Compensation refund for booking #${booking.id}`
        });

        throw err;
    }

    await sendNotification({
        recipientId: req.user.id,
        recipientRole: "user",
        type: "BOOKING_CONFIRMED",
        message: `Booking #${booking.id} confirmed.`,
        data: {
            bookingId: booking.id,
            seats: seatIds,
            totalPrice,
        },
    });

    await sendNotification({
        recipientRole: "admin",
        type: "NEW_BOOKING",
        message: `New booking created.`,
        data: {
            bookingId: booking.id,
            userId: req.user.id,
        },
    });

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
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
        logger.warn("Booking cancellation failed: booking not found", {
            bookingId: req.params.id,
            userId: req.user.id,
        });

        throw new AppError(errorMessages.BOOKING.NOT_FOUND, 404);
    }

    if (booking.userId !== req.user.id) {
        logger.warn("Unauthorized booking cancellation attempt", {
            bookingId: booking.id,
            userId: req.user.id,
        });

        throw new AppError(errorMessages.USER.UNAUTHORIZED, 403);
    }

    if (booking.status === "cancelled") {
        logger.warn("Booking already cancelled", {
            bookingId: booking.id,
            userId: req.user.id,
        });

        throw new AppError(errorMessages.BOOKING.ALREADY_CANCELLED, 400);
    }

    const refund = await paymentClient.refundUser({
        userId: req.user.id,
        bookingId: booking.id,
        amount: booking.totalPrice,
        description: `Refund for booking #${booking.id}`,
    });

    await booking.update({ status: "cancelled" });

    await sendNotification({
        recipientId: req.user.id,
        recipientRole: "user",
        type: "BOOKING_CANCELLED",
        message: `Booking cancelled successfully.`,
        data: { bookingId: booking.id },
    });

    res.status(200).json({
        message: "Booking cancelled successfully.",
        refundedAmount: booking.totalPrice,
        remainingBalance: refund.balanceAfter,
    });

};

module.exports = { createBooking, getAllBookings, getMyBookings,cancelBooking };