const express = require("express");
const router = express.Router();

const { createBooking, getAllBookings, getMyBookings, cancelBooking } = require("../controllers/bookingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// User
router.post("/create", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);

// Admin
router.get("/", protect, adminOnly, getAllBookings);

module.exports = router;