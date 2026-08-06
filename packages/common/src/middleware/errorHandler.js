const { errorMessages } = require("../constants");
const { AppError } = require("../errors")
const { logger } = require("../logger");

const notFound = (req, res, next) => {
    next(
        new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404 )
    );
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || errorMessages.GENERAL.INTERNAL_SERVER_ERROR;

    // Sequelize
    if (err.name === "SequelizeValidationError") {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(",");
    }

    if (err.name === "SequelizeUniqueConstraintError") {
        statusCode = 409;
        message = err.errors.map(e => e.message).join(",");
    }

    if (err.name === "SequelizeForeignKeyConstraintError") {
        statusCode = 409;
        message = err.errors.map(e => e.message).join(",");
    }

    // JWT
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = errorMessages.AUTH.INVALID_TOKEN;
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = errorMessages.AUTH.TOKEN_EXPIRED;
    }

    // Invalid JSON
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        statusCode = 400;
        message = errorMessages.GENERAL.INVALID_JSON;
    }

    logger.error(message, {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode,
    })

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = { notFound, errorHandler }