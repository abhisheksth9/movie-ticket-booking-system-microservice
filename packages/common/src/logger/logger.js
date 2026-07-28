const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",

    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),

        format.errors({
            stack: true,
        }),

        format.printf(({ timestamp, level, message, stack, ...meta }) => {

            const service = process.env.SERVICE_NAME || "unknown-service";

            let log = `[${timestamp}] [${service}] ${level.toUpperCase()}: ${message}`;

            if (Object.keys(meta).length) {
                log += `\n${JSON.stringify(meta, null, 2)}`;
            }

            if (stack) {
                log += `\n${stack}`;
            }

            return log;
        })
    ),

    transports: [
        new transports.Console(),
    ],
});

module.exports = logger;