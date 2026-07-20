const { Op } = require("sequelize");
const {Booking,BookingSeat,sequelize,} = require("../../models");
const catalogClient = require("../utils/catalogClient");
const paymentClient = require("../utils/paymentClient");
const { sendNotification } = require("../utils/notificationService");

const createBooking = async (req, res) => {

    const { showtimeId, seatIds } = req.body;
    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
        return res.status(400).json({ message: "ShowtimeId and seatIds are required.",});
    }

    const showtime = await catalogClient.getShowtime(showtimeId);

    if (!showtime) {
        return res.status(404).json({ message: "Showtime not found"});
    }

    const seats = await catalogClient.getTheaterSeats(showtime.theaterId);

    const selectedSeats = seats.filter((seat) =>
        seatIds.includes(seat.id)
    );

    if (selectedSeats.length !== seatIds.length) {
        return res.status(404).json({ message: "One or more seats not found." });
    }

    const alreadyBooked = await BookingSeat.findAll({
        include: [{
                model: Booking,
                where: {
                    showtimeId,
                    status: {
                        [Op.ne]: "cancelled",
                    },
                },
                attributes: [],
            },
        ],
        where: {
            seatId: {
                [Op.in]: seatIds,
            },
        },
    });

    if (alreadyBooked.length > 0) {
        return res.status(409).json({
            message: "One or more seats are already booked.",
            bookedSeatIds: alreadyBooked.map((seat) => seat.seatId),
        });
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
                })),
                { transaction }
            );

            return newBooking;

        });

    } catch (err) {
        return res.status(409).json(
            { message: "Seats have just been booked by another user." });
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
        await booking.update({ status: "cancelled"});

        return res.status(err.status || 502).json({ message: err.message });}

    try {
        await booking.update({ status: "confirmed",});
    } catch (err) {
        await paymentClient.refundUser({
            userId: req.user.id,
            bookingId: booking.id,
            amount: totalPrice,
            description: `Compensation refund for booking #${booking.id}`, });
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
    res.status(200).json(bookings);
};

const cancelBooking = async (req, res) => {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized."});
    }

    if (booking.status === "cancelled") {
        return res.status(400).json({ message: "Booking already cancelled." });
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