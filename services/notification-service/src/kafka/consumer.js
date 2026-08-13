const { kafka } = require('@movie/common').kafka;
const { logger } = require('@movie/common').logger;
const { createNotification } = require('../services/notificationService');

const consumer = kafka.consumer({ groupId: 'notification-group'});
const TOPICS = ['booking-events', 'payment-events'];

const EVENT_HANDLERS = {
    'booking.confirmed': (event) => ({
        recipientId: event.userId,
        recipientRole: 'user',
        type: 'BOOKING_CONFIRMED',
        message: `Booking #${event.bookingId} confirmed`,
        data: event,
    }),
    'booking.cancelled': (event) => ({
        recipientId: event.userId,
        recipientRole: 'user',
        type: 'BOOKING_CANCELLED',
        message: `Booking #${event.bookingId} cancelled`,
        data: event,
    }),
    'payment.charged': (event) => ({
        recipientId: event.userId,
        recipientRole: 'user',
        type: 'PAYMENT_CHARGED',
        message: `Booking #${event.amount} processed`,
        data: event,
    }),
    'payment.refunded': (event) => ({
        recipientId: event.userId,
        recipientRole: 'user',
        type: 'PAYMENT_REFUNDED',
        message: `Refund of ${event.amount} processed.`,
        data: event,
    }),
};

async function startKafkaConsumer() {
    await consumer.connect();
    await consumer.subscribe({topics: TOPICS, fromBeginning: true});
    
    logger.info( `[Notification Service] Kafka consumer started, subscribed to: ${TOPICS.join(", ")}`);
    
    await consumer.run({
        eachMessage: async({ topic, message }) => {
            let event;
            try {
                event = JSON.parse(message.value.toString());
            } catch(err) {
                logger.error(`[Notification Service] Failed to parse Kafka message on ${topic}: ${err.message}`);
                return;
            }

            const buildNotification = EVENT_HANDLERS[event.type];
            if(!buildNotification) {
                logger.warn(`[Notification Service] No handler for event type "${event.type}" on ${topic}`);
                return;
            }

            try {
                await createNotification(buildNotification(event));
                logger.info(`[Notification Service] Processed ${event.type}`, {
                    bookingId: event.bookingId,
                    userId: event.userId,
                });
            } catch (err) {
                logger.error(`[Notification Service] Failed to process ${event.type}: ${err.message}`);
            }
        },
    })
    
    logger.info(`[Notification Service] Kafka consumer started, subscribed to: ${TOPICS.join(',')}`);
}

module.exports = { startKafkaConsumer };