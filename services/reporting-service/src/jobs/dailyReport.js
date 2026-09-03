const cron = require('node-cron');
const { generateDailyReport } = require('../services/reportGenerator');

const getYesterdayDateString = () => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().split('T')[0];
};

    cron.schedule('15 04 * * *', async() => {
    const date = getYesterdayDateString();
    try {
        await generateDailyReport(date);
        console.log(`Daily report generated for ${date}`);
    } catch (err) {
        console.error(`Daily report generation failed for ${date}: `, err.message);
    }
}, {
    timezone: 'UTC'
});