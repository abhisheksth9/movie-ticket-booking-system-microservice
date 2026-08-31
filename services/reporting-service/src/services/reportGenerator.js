const axios = require('axios');
const { DailyReport } = require('../../models');
const { buildReportPdf } = require('./reportPdfBuilder');
const { uploadReportPdf } = require('./reportFileUploader');

const internalHeaders = { 'x-internal-api-key': process.env.INTERNAL_API_KEY };

const fetchStats = async (baseUrl, date) => {
  try {
    const { data } = await axios.get(`${baseUrl}/internal/reports/daily-stats`, {
      params: { date }, 
      headers: internalHeaders,
      timeout: 5000
    });
    return data;
  } catch (err) {
    console.error(`Failed to fetch stats from ${baseUrl}:`, err.message);
    return {};
  }
};

const generateDailyReport = async (date) => {
  const [auth, booking, payment] = await Promise.all([
    fetchStats(process.env.AUTH_SERVICE_URL, date),
    fetchStats(process.env.BOOKING_SERVICE_URL, date),
    fetchStats(process.env.PAYMENT_SERVICE_URL, date)
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
  
  try{
    const pdfBuffer = await buildReportPdf(report);
    const fileKey = await uploadReportPdf(date, pdfBuffer);
    await report.update({ reportFileKey: fileKey });
  } catch (err) {
    console.error(`PDF export failed for ${date}:`, err.message);
  }
  
  return report;
};

module.exports = { generateDailyReport };