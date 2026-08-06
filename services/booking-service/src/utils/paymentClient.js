// const createHttpClient = require("./httpClient");

// const paymentClient = createHttpClient(
//     process.env.PAYMENT_SERVICE_URL
// );

// class PaymentError extends Error {
//     constructor(message, status) {
//         super(message);
//         this.name = 'PaymentError';
//         this.status = status;
//     }
// }

// const chargeUser = async({ userId, amount, bookingId, description }) => {
//     try {
//         const {data} = await paymentClient.post('/api/payments/charge', {
//             userId, amount, bookingId, description
//         });
//         return data;
//     } catch (err) {
//         if(err.response) {
//             throw new PaymentError(err.response.data?.message || 'Payment Failed', err.response.status);
//         }
//         throw new PaymentError(`Payment Service unreachable: ${err.message}`);
//     }
// };

// const refundUser = async({ userId, amount, bookingId, description}) => {
//     try {
//         const {data} = await paymentClient.post('/api/payments/refund', {
//             userId, amount, bookingId, description
//         });
//         return data;
//     } catch (err) {
//         if(err.response) {
//             throw new PaymentError(err.response.data?.message || 'Refund Failed', err.response.status);
//         }
//         throw new PaymentError(`Payment Service unreachable: ${err.message}`);
//     }
// }

// module.exports = { chargeUser, refundUser, PaymentError };