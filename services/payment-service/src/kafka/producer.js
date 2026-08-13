const { kafka } = require('@movie/common').kafka;
const { logger } = require('@movie/common').logger;

const producer = kafka.producer();
let connected = false;

async function connectProducer() {
    if(!connected) {
        await producer.connect();
        connected = true;
        logger.info('[Payment Service] Kafka producer connected');
    }
}

async function publishPaymentEvent(type, payload) {
    try{
        await connectProducer();
        await producer.send({
            topic: 'payment-events',
            messages: [{
                value: JSON.stringify({ type, ...payload, timestamp: new Date().toISOString() }),
            }],
        });
    } catch (err) {
        logger.error(`[Payment Service] Failed to publish ${type} event: ${err.message}`);
    }
}

module.exports = { publishPaymentEvent };