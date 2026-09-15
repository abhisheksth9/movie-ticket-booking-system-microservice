const Redis = require("ioredis");
const { logger } = require('@movie/common');

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redisClient.on('connect', () => {
    logger.info('Booking Service connected to Redis');
})

redisClient.on('error', (err) => {
    logger.error(`Redis connection error in Booking Service: ${err.message}`);
});

module.exports = redisClient;