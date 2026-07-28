const Joi = require("joi");

const id = Joi.number().integer().positive().messages({
    'number.base': 'id must be a number',
    'number.integer': 'id must be an integer',
    'number.positive': 'id must be a positive number',
})

const idParam = Joi.object({
    id: id.required(),
});

const email = Joi.string().trim().lowercase().email({ tlds: { allow: false }}).messages({
    'string.email': 'Please provide a valid email address',
})

const password = Joi.string().min(6).max(20).messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password must be at most 20 characters.'
});

const name = Joi.string().trim().min(2).max(20).messages({
  'string.min': 'Name must be at least 2 characters long',
  'string.max': 'Name must not exceed 20 characters',
});

const isoDate = Joi.date().iso();

const money = Joi.number().positive().precision(2).messages({
  'number.positive': 'Amount must be greater than 0',
});

module.exports = { id, idParam, email, password, name, isoDate, money };
