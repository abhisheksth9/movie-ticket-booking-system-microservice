const express = require("express");
const router = express.Router();

const { getAllShowtimes, getShowtimebyId, createShowtime, deleteShowtime} = require("../controllers/showtimeController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const internalApi = require("../middleware/internalApiMiddleware");

// Public
router.get("/", getAllShowtimes);
router.get("/:id", getShowtimebyId);

// Admin
router.post("/create", protect, adminOnly, createShowtime);
router.delete("/:id", protect, adminOnly, deleteShowtime);

// Internal
router.get("/internal/:id", internalApi, getShowtimebyId);

module.exports = router;