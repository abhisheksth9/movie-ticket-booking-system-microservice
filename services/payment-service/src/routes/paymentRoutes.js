const express = require("express");
const router = express.Router();

const internalApi = require("../middleware/internalApiMiddleware");

const { charge, refund } = require("../controllers/paymentController");

// Internal endpoints (Booking Service only)
router.post("/charge", internalApi, charge);
router.post("/refund", internalApi, refund);

module.exports = router;