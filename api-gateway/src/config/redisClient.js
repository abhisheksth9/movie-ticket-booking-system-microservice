const { logger } = require('@movie/common').logger;
const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('connect', () => {
  logger.info("Redis Connected");
});

redisClient.on('error', (err) => {
    logger.error(`[Redis] ${err.message}`);
});

module.exports = redisClient;
