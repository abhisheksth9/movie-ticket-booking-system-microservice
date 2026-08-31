const express = require('express');
const { internalApiMiddleware } = require('@movie/common').middleware;
const { getDailyStats } = require('../controllers/reportController');

const router = express.Router();
router.get('/daily-stats', internalApiMiddleware, getDailyStats);

module.exports = router;