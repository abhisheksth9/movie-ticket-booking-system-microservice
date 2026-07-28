const { errorMessages } = require("../constants");
const { AppError } = require("../errors");

const internalApiMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-internal-api-key"];

    if (!apiKey) {
        return next(
            new AppError(errorMessages.AUTH.INTERNAL_API_KEY_MISSINGS, 401)
        );
    }

    if (apiKey !== process.env.INTERNAL_API_KEY) {
        return next(
            new AppError(errorMessages.AUTH.INVALID_INTERNAL_API_KEY, 403)
        );
    }

    next();

};

module.exports = { internalApiMiddleware };