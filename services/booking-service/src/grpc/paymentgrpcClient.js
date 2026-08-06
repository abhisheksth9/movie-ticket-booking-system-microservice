const grpc = require("@grpc/grpc-js");
const { proto } = require("@movie/common");

const paymentProto = proto.loadProto("payment.proto", "payment");

const client = new paymentProto.PaymentService(
    process.env.PAYMENT_GRPC_URL || "localhost:50054",
    grpc.credentials.createInsecure()
);

function chargeUser({ userId, bookingId, amount, description = "" }) {
    return new Promise((resolve, reject) => {
        client.ChargeUser({ userId, bookingId, amount, description }, (err, response) => {
            if (err) return reject(err);
            if (!response.success) return reject(new Error(response.message));
            resolve(response);
        });
    });
}

function refundUser({ userId, bookingId, amount, description = "" }) {
    return new Promise((resolve, reject) => {
        client.RefundUser({ userId, bookingId, amount, description }, (err, response) => {
            if (err) return reject(err);
            if (!response.success) return reject(new Error(response.message));
            resolve(response);
        });
    });
}

module.exports = { chargeUser, refundUser };