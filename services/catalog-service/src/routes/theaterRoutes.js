const express = require("express");
const router = express.Router();

const { getAllTheaters, getTheaterById, createTheater, getSeats } = require("../controllers/theaterController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const internalApi = require("../middleware/internalApiMiddleware");

// Public
router.get("/", getAllTheaters);
router.get("/:id", getTheaterById);
router.get("/:id/seats", getSeats);

// Admin
router.post("/create", protect, adminOnly, createTheater);

// Internal
router.get("/internal/:id/seats", internalApi, getSeats);

module.exports = router;