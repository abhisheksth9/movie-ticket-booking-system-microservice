const Joi = require('joi');
const { id, isoDate } = require('@movie/common').schemas;

const fields = {
  title: Joi.string().trim().min(1).max(150),
  description: Joi.string().trim().max(2000).allow(''),
  duration: Joi.number().integer().min(1).max(600),
  genre: Joi.array().min(1),
  language: Joi.string(),
};

const createMovieSchema = Joi.object({
  title: fields.title.required(),
  description: fields.description.optional(),
  duration: fields.duration.required().messages({
    'any.required': 'duration is required',
  }),
  genre: fields.genre.required().messages({
    'array.min': 'At least one genre must be selected',
  }),
  language: fields.language.default('English'),
});

const updateMovieSchema = Joi.object({
  title: fields.title.optional(),
  description: fields.description.optional(),
  duration: fields.duration.optional(),
  genre: fields.genre.optional(),
  language: fields.language.optional(),
})
  .min(1)
  .messages({
    'object.min': 'Provide at least one field to update',
  });

const movieIdParamSchema = Joi.object({
  id: id.required(),
});

const listMoviesQuerySchema = Joi.object({
  search: Joi.string().trim().max(100).optional(),
});

module.exports = {
  createMovieSchema,
  updateMovieSchema,
  movieIdParamSchema,
  listMoviesQuerySchema,
  GENRES,
  LANGUAGES,
};
