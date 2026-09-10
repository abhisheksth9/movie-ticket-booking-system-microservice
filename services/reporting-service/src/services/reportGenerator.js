const axios = require('axios');
const { logger } = require('@movie/common');
const { DailyReport } = require('../../models');
const { buildReportPdf } = require('./reportPdfBuilder');
const { uploadReportPdf } = require('./reportFileUploader');

const fetchStats = async (baseUrl, date, requestId) => {
  try {
    const { data } = await axios.get(`${baseUrl}/internal/reports/daily-stats`, {
      params: { date },
      headers: {
        'x-internal-api-key': process.env.INTERNAL_API_KEY,
        'x-request-id': requestId,
      },
      timeout: 5000
    });
    return data;
  } catch (err) {
    logger.error(`Failed to fetch stats from ${baseUrl}`, { requestId, date, error: err.message });
    return {};
  }
};

const generateDailyReport = async (date, requestId) => {
  const [auth, booking, payment] = await Promise.all([
    fetchStats(process.env.AUTH_SERVICE_URL, date, requestId),
    fetchStats(process.env.BOOKING_SERVICE_URL, date, requestId),
    fetchStats(process.env.PAYMENT_SERVICE_URL, date, requestId)
  ]);

  const payload = {
    date,
    newUsers: auth.newUsers || 0,
    logins: auth.logins || 0,
    deletions: auth.deletions || 0,
    bookingsCreated: booking.bookingsCreated || 0,
    bookingsCancelled: booking.bookingsCancelled || 0,
    paymentsProcessed: payment.paymentsProcessed || 0,
    totalRevenue: payment.totalRevenue || 0,
    refundsIssued: payment.refundsIssued || 0,
    totalRefunded: payment.totalRefunded || 0,
    walletTopups: payment.walletTopups || 0,
    totalTopupAmount: payment.totalTopupAmount || 0,
    generatedAt: new Date()
  };

  const [report] = await DailyReport.upsert(payload, { returning: true });

  try {
    const pdfBuffer = await buildReportPdf(report);
    const fileKey = await uploadReportPdf(date, pdfBuffer);
    await report.update({ reportFileKey: fileKey });
  } catch (err) {
    logger.error(`PDF export failed for ${date}`, { requestId, date, error: err.message });
  }

  return report;
};

module.exports = { generateDailyReport };