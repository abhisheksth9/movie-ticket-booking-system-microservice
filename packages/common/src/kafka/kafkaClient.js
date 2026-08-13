const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || 'movie-ticket-booking-system',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

module.exports = { kafka };