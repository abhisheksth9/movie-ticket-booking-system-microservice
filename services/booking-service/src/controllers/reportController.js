const { Booking } = require('../../models');
const { Op } = require('sequelize');

const getDailyStats = async (req, res, next) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'date query param is required' });
        }

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const dateRange = {[Op.between]: [startOfDay, endOfDay]};

        const [bookingsCreated, bookingsCancelled] = await Promise.all([
            Booking.count({ where: { createdAt: dateRange } }),
            Booking.count({ where: { status: 'CANCELLED', updatedAt: dateRange } })
        ]);

        res.status(200).json({ date, bookingsCreated, bookingsCancelled });
    } catch (err) {
        next(err);
    }
};

module.exports = { getDailyStats }