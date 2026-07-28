const express = require("express");
const router = express.Router();

const { createBooking, getAllBookings, getMyBookings, cancelBooking } = require("../controllers/bookingController");
const { protect, adminOnly } = require("@movie/common").middleware;

const { validate } = require("@movie/common").validators;
const {
    createBookingSchema,
    bookingIdParamSchema,
    listBookingsQuerySchema,
    listAllBookingsQuerySchema,
} = require("@movie/common").validators;

router.post("/create", validate({ body: createBookingSchema}), protect, createBooking);
router.get("/my", validate({ query: listBookingsQuerySchema}), protect, getMyBookings);
router.put("/:id/cancel",validate({ params: bookingIdParamSchema}), protect, cancelBooking);
router.get("/", validate({ query: listAllBookingsQuerySchema}), protect, adminOnly, getAllBookings);

module.exports = router;