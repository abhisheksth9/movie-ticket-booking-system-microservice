const redisClient = require("../config/redisClient");
const { AppError } = require("@movie/common").errors;
const { logger } = require("@movie/common").logger;

const INCREMENT_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
return current
`;

function createRateLimiter({ keyPrefix, windowSeconds, max }) {
    return async function rateLimiter(req, res, next) {
        const key = `ratelimit:${keyPrefix}:${req.ip}`;

        let count;
        let ttl;

        try {
            count = await redisClient.eval(INCREMENT_SCRIPT, 1, key, windowSeconds);
            ttl = await redisClient.ttl(key);

            console.log({ key, count, ttl, max, windowSeconds });
        } catch (err) {
            logger.error(`[Rate Limiter] Redis error: ${err.message}`);
            return next();
        }

        if (count > max) {
            res.set("Retry-After", String(ttl > 0 ? ttl : windowSeconds));

            return next(
                new AppError("Too many requests, please try again later", 429)
            );
        }

        return next();
    };
}

const generalRateLimiter = createRateLimiter({
    keyPrefix: "general",
    windowSeconds: 60,
    max: 100
});

const authRateLimiter = createRateLimiter({
    keyPrefix: "auth",
    windowSeconds: 60,
    max: 5
});

module.exports = {
    generalRateLimiter,
    authRateLimiter
};