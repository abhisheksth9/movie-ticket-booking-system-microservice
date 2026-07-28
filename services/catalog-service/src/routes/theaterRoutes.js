const express = require("express");
const router = express.Router();

const { getAllTheaters, getTheaterById, createTheater, getSeats } = require("../controllers/theaterController");

const { protect, adminOnly, internalApiMiddleware } = require("@movie/common").middleware;
const { validate } = require("@movie/common").validators;
const {
    createTheaterSchema,
    updateTheaterSchema,
    theaterIdParamSchema,
    listTheatersQuerySchema,
} = require("@movie/common").validators;

router.get("/", validate({ query: listTheatersQuerySchema }), getAllTheaters);
router.get("/:id", validate({ params: theaterIdParamSchema }), getTheaterById);
router.get("/:id/seats", validate({ params: theaterIdParamSchema }), getSeats);
router.post("/create", validate({ body: createTheaterSchema }), protect, adminOnly, createTheater);

router.get("/internal/:id/seats", internalApiMiddleware, getSeats);

module.exports = router;