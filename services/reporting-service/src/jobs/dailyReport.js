const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const { generateDailyReport } = require('../services/reportGenerator');
const { DailyReport } = require('../../models');

const getYesterdayDateString = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
};

const ensureYesterdayReportExists = async () => {
  const date = getYesterdayDateString();
  const existing = await DailyReport.findOne({ where: { date } });

  if (!existing) {
    const requestId = uuidv4();
    console.log(`[STARTUP-CATCHUP] No report found for ${date}, generating now (requestId: ${requestId})`);
    await generateDailyReport(date, requestId);
  }
};

ensureYesterdayReportExists().catch((err) => {
  console.error('Startup catch-up check failed:', err.message);
});

cron.schedule('15 08 * * *', async () => {
  const date = getYesterdayDateString();
  const requestId = uuidv4();
  try {
    await generateDailyReport(date, requestId);
    console.log(`Daily report generated for ${date}`);
  } catch (err) {
    console.error(`Daily report generation failed for ${date}:`, err.message);
  }
}, {
  timezone: 'UTC'
});