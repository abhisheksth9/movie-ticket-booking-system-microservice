const { kafka } = require('@movie/common').kafka;
const { logger } = require('@movie/common');

const producer = kafka.producer();
let connected = false;

async function connectProducer() {
    if (!connected) {
        await producer.connect();
        connected = true;
        logger.info('[Booking Service] Kafka producer connected');
    }
}

async function publishBookingEvent(type, payload, requestId) {
    try {
        await connectProducer();
        await producer.send({
            topic: 'booking-events',
            messages: [{
                value: JSON.stringify({type, ...payload, timestamp: new Date().toISOString() }),
                headers: requestId ? { 'x-request-id': requestId } : undefined,
            }],
        });
    } catch (err) {
        logger.error(`[Booking Service] failed to publish ${type} event: ${err.message}`, {requestId})
    }
}

module.exports = { publishBookingEvent }