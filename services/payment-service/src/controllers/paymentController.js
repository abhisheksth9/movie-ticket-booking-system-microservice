const { Wallet, WalletTransaction, sequelize } = require("../../models");
const { logger } = require("@movie/common").logger;
const { publishPaymentEvent } = require("../kafka/producer");

const charge = async (req, res) => {
    const { userId, amount, bookingId, description } = req.body;
    let result;

    try {
        result = await sequelize.transaction(async (transaction) => {
            const [wallet] = await Wallet.findOrCreate({
                where: { userId },
                defaults: { balance: 0 },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            const balanceBefore = Number(wallet.balance);

            if (balanceBefore < Number(amount)) {
                const error = new Error("Insufficient balance");
                error.status = 400;
                error.shortfall = Number(
                    (Number(amount) - balanceBefore).toFixed(2)
                );
                throw error;
            }

            const balanceAfter = Number((balanceBefore - Number(amount)).toFixed(2));

            await wallet.update( { balance: balanceAfter }, { transaction });

            const payment = await WalletTransaction.create({
                    userId,
                    bookingId: bookingId || null,
                    type: "payment",
                    amount,
                    description: description || `Payment for booking #${bookingId}`,
                    balanceBefore,
                    balanceAfter,
                }, { transaction }
            );
            return { payment, balanceBefore, balanceAfter };
        });
    } catch (error) {
        if (error.status === 400) {
            logger.warn("Payment failed: insufficient balance", {
                requestId: req.requestId,
                bookingId,
                amount,
                shortfall: error.shortfall,
            });
            return res.status(400).json({
                message: error.message,
                shortfall: error.shortfall,
            });
        }
        throw error;
    }

    logger.info("Payment successful", {
        requestId: req.requestId,
        userId,
        bookingId,
        transactionId: result.payment.id,
        amount,
        balanceAfter: result.balanceAfter,
    });

    await publishPaymentEvent('payment.charged', { 
        userId, 
        bookingId, 
        amount, 
        balanceAfter: result.balanceAfter 
    });

    res.status(200).json({
        message: "Payment successful.",
        transactionId: result.payment.id,
        balanceAfter: result.balanceAfter,
    });
};

const refund = async (req, res) => {
    const { userId, amount, bookingId, description } = req.body;

    const result = await sequelize.transaction(async (transaction) => {
        const [wallet] = await Wallet.findOrCreate({
            where: { userId },
            defaults: { balance: 0 },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        const balanceBefore = Number(wallet.balance);

        const balanceAfter = Number((balanceBefore + Number(amount)).toFixed(2));

        await wallet.update( { balance: balanceAfter }, { transaction });

        const refund = await WalletTransaction.create({
                userId,
                bookingId: bookingId || null,
                type: "refund",
                amount,
                description: description || `Refund for booking #${bookingId}`,
                balanceBefore,
                balanceAfter,
            }, { transaction }
        );
        return { refund, balanceBefore, balanceAfter };
    });

    logger.info("Refund successful", {
        requestId: req.requestId,
        userId,
        bookingId,
        transactionId: result.refund.id,
        amount,
        balanceAfter: result.balanceAfter,
    });

    await publishPaymentEvent('payment.refunded', { 
        userId, 
        bookingId, 
        amount, 
        balanceAfter: result.balanceAfter
    });

    res.status(200).json({
        message: "Refund successful.",
        transactionId: result.refund.id,
        balanceAfter: result.balanceAfter,
    });
};

module.exports = { charge, refund };