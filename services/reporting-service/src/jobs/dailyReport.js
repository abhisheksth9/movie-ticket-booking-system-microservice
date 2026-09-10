const cron = require('node-cron');
const { v4: uuid } = require('uuid');
const { logger } = require('@movie/common');
const { generateDailyReport } = require('../services/reportGenerator');

const getYesterdayDateString = () => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().split('T')[0];
};

cron.schedule('15 06 * * *', async () => {
    const date = getYesterdayDateString();
    const requestId = uuid();
    try {
        await generateDailyReport(date, requestId);
        logger.info(`Daily report generated for ${date}`, { requestId, date });
    } catch (err) {
        logger.error(`Daily report generation failed for ${date}`, { requestId, date, error: err.message });
    }
}, {
    timezone: 'UTC'
});