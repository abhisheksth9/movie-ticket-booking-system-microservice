const { User, AuditLog  } = require("../../models");
const { Op } = require('sequelize');

const getDailyStats = async(req, res, next) => {
    try{
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'date query param is required' });
        }

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const dateRange = { [Op.between]: [startOfDay, endOfDay]}

        const [newUsers, logins, deletions ] = await Promise.all([
            User.count({ where: { createdAt: dateRange} }),
            AuditLog.count({where: { action: 'LOGIN', createdAt: dateRange} }),
            AuditLog.count({where: { action: 'DELETE', createdAt: dateRange}}),         
        ]);

        res.status(200).json({date, newUsers, logins, deletions});
    } catch (err) {
        next(err);
    }
};

module.exports = { getDailyStats };