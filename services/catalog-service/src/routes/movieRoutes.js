const express = require("express");
const router = express.Router();

const { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require("../controllers/movieController");

const { protect, adminOnly, internalApiMiddleware } = require("@movie/common").middleware;
const { validate } = require("@movie/common").validators;
const {
  createMovieSchema,
  updateMovieSchema,
  movieIdParamSchema,
  listMoviesQuerySchema,
} = require("@movie/common").validators;

router.get("/", validate({ query: listMoviesQuerySchema }), getAllMovies);
router.get("/:id", validate({ params: movieIdParamSchema }), getMovieById);
router.post("/create", validate({ body: createMovieSchema }), protect, adminOnly, createMovie);
router.put("/update/:id", validate({ body: updateMovieSchema }), protect, adminOnly, updateMovie);
router.delete("/del/:id", validate({ params: movieIdParamSchema }), protect, adminOnly, deleteMovie);

router.get("/internal/:id", internalApiMiddleware , getMovieById);

module.exports = router;