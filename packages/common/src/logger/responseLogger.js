const logger = require("./logger");

const responseLogger = (req, res, next) => {

    const originalJson = res.json.bind(res);

    res.json = ( body ) => {
        const end = process.hrtime.bigint();
        
        const duration = Number(end - req.startTime) / 1000000;

        logger.info("Incoming Response", {
            requestId: req.requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration.toFixed(2)} ms` 
        });

        return originalJson(body);
    }

    next();
};

module.exports = responseLogger;