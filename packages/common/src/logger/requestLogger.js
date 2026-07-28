const logger = require("./logger");

const requestLogger = (req, res, next) => {

    req.startTime = process.hrtime.bigint();

    logger.info("Incoming Request", {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
    });

    next();
};

module.exports = requestLogger;