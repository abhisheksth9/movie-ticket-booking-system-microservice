const express = require('express');
const router = express.Router();
const { internalApiMiddleware } = require('@movie/common').middleware;
const { getDailyStats } = require('../controllers/reportController');

router.get('/daily-stats', internalApiMiddleware, getDailyStats);

module.exports = router;