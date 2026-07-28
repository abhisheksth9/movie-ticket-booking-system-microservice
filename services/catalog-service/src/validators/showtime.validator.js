const Joi = require('joi');
const { id, money } = require('@movie/common').schemas;

const fields = {
  movieId: id,
  theaterId: id,
  startTime: Joi.date().iso().greater('now').messages({
    'date.greater': 'startTime must be in the future',
  }),
  endTime: Joi.date().iso().messages({
    'date.greater': 'End time must be a valid ISO date',
  }),
  price: money,
};

const createShowtimeSchema = Joi.object({
  movieId: fields.movieId.required(),
  theaterId: fields.theaterId.required(),
  startTime: fields.startTime.required().messages(),
  endTime: fields.endTime
    .greater(Joi.ref("startTime"))
    .required()
    .messages({ "date.greater": "End time must be after start time" }),
  price: fields.price.required(),
});

const showtimeIdParamSchema = Joi.object({
    id: id.required(),
});

const listShowtimesQuerySchema = Joi.object({
  movieId: id.optional(),
  theaterId: id.optional(),
});

module.exports = {
  createShowtimeSchema,
  showtimeIdParamSchema,
  listShowtimesQuerySchema,
};