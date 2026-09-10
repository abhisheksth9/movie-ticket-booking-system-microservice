    const { proto, grpc } = require("@movie/common");
    const paymentProto = proto.loadProto("payment.proto", "payment");

    const client = new paymentProto.PaymentService(
        process.env.PAYMENT_GRPC_URL || "localhost:50054",
        grpc.credentials.createInsecure()
    );

    function buildMetadata(requestId) {
        const metadata = new grpc.Metadata();
        if (requestId) {
            metadata.set('x-request-id', requestId);
        }
        return metadata;
    }

    function chargeUser({ userId, bookingId, amount, description = "" }, requestId) {
        return new Promise((resolve, reject) => {
            client.ChargeUser({ userId, bookingId, amount, description }, buildMetadata(requestId), (err, response) => {
                if (err) return reject(err);
                if (!response.success) return reject(new Error(response.message));
                resolve(response);
            });
        });
    }

    function refundUser({ userId, bookingId, amount, description = "" }, requestId) {
        return new Promise((resolve, reject) => {
            client.RefundUser({ userId, bookingId, amount, description }, buildMetadata(requestId), (err, response) => {
                if (err) return reject(err);
                if (!response.success) return reject(new Error(response.message));
                resolve(response);
            });
        });
    }

    module.exports = { chargeUser, refundUser };