const express = require("express");
const router = express.Router();

const { charge, refund } = require("../controllers/paymentController");
const { internalApiMiddleware } = require("@movie/common").middleware;

// Internal endpoints (Booking Service only)
router.post("/charge", internalApiMiddleware, charge);
router.post("/refund", internalApiMiddleware, refund);

module.exports = router;