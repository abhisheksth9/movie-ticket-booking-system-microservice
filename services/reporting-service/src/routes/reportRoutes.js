const express = require('express');
const { protect, adminOnly } = require('@movie/common').middleware;
const { getReportByDate, listReports, regenerateReport, downloadReportPdf } = require('../controllers/reportController');

const router = express.Router();

router.get('/', protect, adminOnly, listReports);
router.get('/:date', protect, adminOnly, getReportByDate);
router.post('/:date/regenerate', protect, adminOnly, regenerateReport);
router.get('/:date/download', protect, adminOnly, downloadReportPdf);

module.exports = router;