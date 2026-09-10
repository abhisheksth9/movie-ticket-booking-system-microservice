const { Wallet, WalletTransaction, sequelize } = require("../../models");
const { proto, grpc, logger } = require("@movie/common");

const paymentProto = proto.loadProto("payment.proto", "payment");
const { publishPaymentEvent } = require("../kafka/producer");

async function chargeUser(call, callback) {
    const requestId = call.metadata.get('x-request-id')[0];
    const { userId, bookingId, amount, description } = call.request;
    const transaction = await sequelize.transaction();
    
    try {
        const wallet = await Wallet.findOne({
            where: { userId },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        
        if (!wallet){
            await transaction.rollback();
            return callback(null, {
                success: false,
                transactionId: 0,
                amount,
                balanceAfter: 0,
                message: "Wallet Not Found",
            });
        }
        
        const balanceBefore = Number(wallet.balance);
        wallet.balance = balanceBefore - amount;
        await wallet.save({ transaction });
        
        const walletTransaction = await WalletTransaction.create({
            userId,
            walletId: wallet.id,
            amount,
            balanceBefore,
            balanceAfter: wallet.balance,
            type: "payment",
            reference: bookingId,
            description,
        }, {transaction});
        
        await transaction.commit();
        
        logger.info("Payment Successful", {
            requestId,
            userId, 
            bookingId, 
            transactionId: walletTransaction.id,
            amount, 
            balanceAfter: wallet.balance
        });
        
        try {
            await publishPaymentEvent('payment.charged', { 
                userId, bookingId, amount, balanceAfter: wallet.balance 
            }, requestId);
        } catch (err) {
            logger.error(`[Payment Service] Failed to publish payment.charged event: ${err.message}`, { requestId });
        }
       
        callback(null, {
            success: true,
            transactionId: walletTransaction.id,
            amount,
            balanceAfter: wallet.balance,
            message: "Payment Successful",
        });
    } catch (err) {
        await transaction.rollback();
        logger.error("Payment failed", { requestId, userId, bookingId, error: err.message });
        callback({ code: grpc.status.INTERNAL, message: err.message, });
    }
}

async function refundUser(call, callback) {
    const requestId = call.metadata.get('x-request-id')[0];
    const { userId, bookingId, amount, description } = call.request;
    const transaction = await sequelize.transaction();
    
    try{
        const wallet = await Wallet.findOne({
            where: { userId },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!wallet) {
            await transaction.rollback();
            return callback(null, {
                success: false,
                transactionId: 0,
                amount,
                balanceAfter: 0,
                message: "Wallet Not Found"
            });
        }

        const balanceBefore = Number(wallet.balance);
        wallet.balance = balanceBefore + amount;
        await wallet.save({ transaction });

        const walletTransaction = await WalletTransaction.create({
            userId,
            walletId: wallet.id,
            amount,
            balanceBefore,
            balanceAfter: wallet.balance,
            type: "refund",
            reference: bookingId,
            description,
        }, {transaction});

        await transaction.commit();

        logger.info("Refund Successful", {
            requestId,
            userId, 
            bookingId, 
            transactionId: walletTransaction.id,
            amount,
            balanceAfter: wallet.balance,
        });

        try {
            await publishPaymentEvent('payment.refunded', {
                userId, bookingId, amount, balanceAfter: wallet.balance,
            }, requestId);
        } catch (err) {
            logger.error(`[Payment Service] Failed to publish payment.refunded event: ${err.message}`, { requestId });
        }
        
        callback(null, {
            success: true,
            transactionId: walletTransaction.id,
            amount,
            balanceAfter: wallet.balance,
            message: "Refund Successful"
        });
    } catch (err) {
        await transaction.rollback();
        logger.error("Refund failed", { requestId, userId, bookingId, error: err.message });
        callback({
            code: grpc.status.INTERNAL,
            message: err.message,
        });
    }
}

function startGrpcServer() {
    const server = new grpc.Server();
    server.addService(paymentProto.PaymentService.service, { chargeUser, refundUser });
    const port = process.env.PAYMENT_GRPC_PORT || 50054;
    
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
        logger.info(`[Payment Service] gRPC server listening on port ${port}`);
    });
}

module.exports = {startGrpcServer};