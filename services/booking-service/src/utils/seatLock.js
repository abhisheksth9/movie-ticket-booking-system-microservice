const redlock = require('../../config/redLock');
const { logger } = require('@movie/common');

const LOCK_TTL_MS = 15000;

function getSeatLockKey(showtimeId, seatId) {
    return `lock:showtime:${showtimeId}:seat:${seatId}`;
}

async function acquireSeatLocks(showtimeId, seatIds) {
    const sortedSeatIds = [...seatIds].sort((a,b) => a - b);
    const acquiredLocks = [];

    try {
        for (const seatId of sortedSeatIds) {
            const key = getSeatLockKey(showtimeId, seatId);
            const lock = await redlock.acquire([key], LOCK_TTL_MS);
            acquiredLocks.push(lock);
        }
        return acquiredLocks;
    } catch (err) {
        await releaseSeatLocks(acquiredLocks);
        logger.error(`Failed to acquire seat locks for showtime ${showtimeId}: ${err.message}`);
        throw new Error('One or more selected seats are currently being hooked by another user. Please try again.');
    }
}

async function releaseSeatLocks(locks) {
    for (const lock of locks) {
        try {
            await lock.release();
        } catch (err) {
            logger.info(`Failed to release seat lock: ${err.message}`);
        }
    }
}

module.exports = { acquireSeatLocks, releaseSeatLocks, getSeatLockKey };