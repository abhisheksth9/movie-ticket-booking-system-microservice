const { Booking } = require('../../models');
const { Op } = require('sequelize');
const { logger } = require('@movie/common');

const getDailyStats = async (req, res, next) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'date query param is required' });
        }

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const dateRange = { [Op.between]: [startOfDay, endOfDay] };

        const [bookingsCreated, bookingsCancelled] = await Promise.all([
            Booking.count({ where: { createdAt: dateRange } }),
            Booking.count({ where: { status: 'CANCELLED', updatedAt: dateRange } })
        ]);

        logger.info('Daily stats fetched', { requestId: req.requestId, date, bookingsCreated, bookingsCancelled });

        res.status(200).json({ date, bookingsCreated, bookingsCancelled });
    } catch (err) {
        logger.error('Daily stats fetch failed', { requestId: req.requestId, error: err.message });
        next(err);
    }
};

module.exports = { getDailyStats };