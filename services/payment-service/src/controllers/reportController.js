const { WalletTransaction } = require('../../models');
const { Op, fn, col } = require('sequelize');

const getTypeSummary = async (type, dateRange ) => {
    const result = await WalletTransaction.findOne({
        attributes: [
            [fn('COUNT', col('id')), 'count'],
            [fn('SUM', col('id')), 'count']
        ],
        where: { type, createdAt: dateRange},
        raw: true
    });

    return {
        count: Number(result.count) || 0,
        total: Number(result.total) || 0
    };
};

const getDailyStats = async (req, res, next) => {
    try{
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'date query param is required'});
        }

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const dateRange = { [Op.between]: [startOfDay, endOfDay] };

        const [charges, refunds, topups] = await Promise.all([
            getTypeSummary('payment', dateRange),
            getTypeSummary('refund', dateRange),
            getTypeSummary('topup', dateRange)
        ]);

        res.status(200).json({
            date,
            paymentsProcessed: charges.count,
            totalRevenue: charges.total,
            refundsIssued: refunds.count,
            totalRefunded: refunds.total,
            walletTopups: topups.count,
            totalTopupAmount: topups.total
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getDailyStats };