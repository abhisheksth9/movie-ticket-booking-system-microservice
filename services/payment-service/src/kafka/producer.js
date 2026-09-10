const { kafka } = require('@movie/common').kafka;
const { logger } = require('@movie/common');

const producer = kafka.producer();
let connected = false;

async function connectProducer() {
    if(!connected) {
        await producer.connect();
        connected = true;
        logger.info('[Payment Service] Kafka producer connected');
    }
}

async function publishPaymentEvent(type, payload, requestId) {
    try{
        await connectProducer();
        await producer.send({
            topic: 'payment-events',
            messages: [{
                value: JSON.stringify({ type, ...payload, timestamp: new Date().toISOString() }),
                headers: requestId ? { 'x-request-id': requestId } : undefined,
            }],
        });
    } catch (err) {
        logger.error(`[Payment Service] Failed to publish ${type} event: ${err.message}`, { requestId });
    }
}

module.exports = { publishPaymentEvent };