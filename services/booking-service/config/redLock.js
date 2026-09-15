const Redlock = require("redlock").default;
const redisClient = require("./redisClient");
const { logger } = require('@movie/common');

const redlock = new Redlock([redisClient], {
    driftFactor: 0.01,
    retryCount: 5,
    retryDelay: 200,
    retryJitter: 100,
});

redlock.on('error', (err) => {
    logger.error(`Redlock error: ${err.message}`);
});

module.exports = redlock;