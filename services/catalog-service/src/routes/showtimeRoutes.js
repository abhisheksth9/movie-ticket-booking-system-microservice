const express = require("express");
const router = express.Router();

const { getAllShowtimes, getShowtimebyId, createShowtime, deleteShowtime} = require("../controllers/showtimeController");

const { protect, adminOnly, internalApiMiddleware } = require("@movie/common").middleware;
const { validate } = require("@movie/common").validators;
const {
    createShowtimeSchema,
    updateShowtimeSchema,
    showtimeIdParamSchema,
    listShowtimesQuerySchema,
} = require("@movie/common").validators;

router.get("/", validate({ query: listShowtimesQuerySchema }), getAllShowtimes);
router.get("/:id", validate({ params: showtimeIdParamSchema }), getShowtimebyId);
router.post("/create", validate({ body: createShowtime }), protect, adminOnly, createShowtime);
router.delete("/:id", validate({ params: showtimeIdParamSchema }), protect, adminOnly, deleteShowtime);

router.get("/internal/:id", internalApiMiddleware, getShowtimebyId);

module.exports = router;