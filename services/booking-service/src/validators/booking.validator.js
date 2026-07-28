const Joi = require('joi');
const { id } = require('@movie/common').schemas;

const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED'];

const createBookingSchema = Joi.object({
    showtimeId: id.required(),
    seatIds: Joi.array()
        .items(id.required())
        .min(1).max(10)
        .unique().required()
        .messages({
            'any.required': 'seatIds is required',
        }),
});

const bookingIdParamSchema = Joi.object({
    id: id.required(),
});

const listBookingsQuerySchema = Joi.object({
    status: Joi.string().valid(...BOOKING_STATUSES).optional(),
});

const listAllBookingsQuerySchema = listBookingsQuerySchema.keys({
    userId: id.optional(),
})

module.exports = {
    createBookingSchema,
    bookingIdParamSchema,
    listBookingsQuerySchema,
    listAllBookingsQuerySchema,
    BOOKING_STATUSES
};