const express = require("express");
const router = express.Router();

const { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require("../controllers/movieController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const internalApi = require("../middleware/internalApiMiddleware");

// Public
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// Admin
router.post("/create", protect, adminOnly, createMovie);
router.put("/update/:id", protect, adminOnly, updateMovie);
router.delete("/del/:id", protect, adminOnly, deleteMovie);

// Internal
router.get("/internal/:id", internalApi, getMovieById);

module.exports = router;