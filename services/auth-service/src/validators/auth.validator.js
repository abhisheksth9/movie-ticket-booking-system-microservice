const Joi = require('joi');
const { email, password, name, id } = require('@movie/common').schemas;

const registerSchema = Joi.object({
    name: name.required(),
    email: email.required(),
    password: password.required()
});

const loginSchema = Joi.object({
    email: email.required(),
    password: password.required()
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().trim().required().messages({
    'any.required': 'refreshToken is required',
  }),
});

const userIdParamSchema = Joi.object({
    id: id.required(),
});

const listUserQuerySchema = Joi.object({
  role: Joi.string().valid('user', 'admin').optional(),
})

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    userIdParamSchema,
    listUserQuerySchema
}