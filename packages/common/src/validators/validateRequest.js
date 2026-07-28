const { logger } = require("../logger");
const { AppError } = require("../errors");

const validateSegment = (schema, payload) => {
    const { error, value } = schema.validate(payload, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    })

    if (!error) return { value, messages: []};

    const messages = error.details.map((detail) => detail.message.replace(/"/g, ''));
    return { value, messages };
};

const validate = (schemas = {}) => {
    const REQUEST_SEGMENTS = ['params', 'query', 'body'];
    const segments = REQUEST_SEGMENTS.filter((segment) => schemas[segment]);

    return (req, res, next) => {
        const errors = [];
        for (const segment of segments) {
            const { value, messages } = validateSegment(schemas[segment], req[segment]);
            if (messages.length) {
                errors.push(... messages);
            } else {
                req[segment] = value;
            }
        }

        if (errors.length) {
            logger.warn("Request Validation Failed", {
                method: req.method,
                url: req.originalUrl,
                requestId: req.id,
                errors
            });
            return next(new AppError(errors.join("; "), 400));
        }

        logger.debug("Request validation passed", {
            method: req.method,
            url: req.originalUrl,
            requestId: req.id,
        });
        return next();
    }
}

module.exports = validate;