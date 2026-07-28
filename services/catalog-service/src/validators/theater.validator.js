const Joi = require('joi');
const { id } = require('@movie/common').schemas;

const fields = {
  name: Joi.string().trim().min(2).max(100),
  location: Joi.string().trim().min(2).max(60),
  totalSeats: Joi.number()
    .integer()
    .min(1)
    .max(1000)
    .messages({
      "number.base": "totalSeats must be a number",
      "number.min": "totalSeats must be at least 1",
    }),
};

const createTheaterSchema = Joi.object({
  name: fields.name.required(),
  location: fields.location.required(),
  totalSeats: fields.totalSeats.required().messages({
    "any.required": "totalSeats is required",
  }),
});

const theaterIdParamSchema = Joi.object({
  id: id.required(),
});

const listTheatersQuerySchema = Joi.object({
  location: Joi.string().trim().optional(),
});

module.exports = {
  createTheaterSchema,
  updateTheaterSchema,
  theaterIdParamSchema,
  listTheatersQuerySchema,
};
