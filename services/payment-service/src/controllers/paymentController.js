const { Wallet, WalletTransaction, sequelize } = require("../../models");
const {sendNotification} = require("../utils/notificationService");

const charge = async (req, res) => {
    const { userId, amount, bookingId, description } = req.body;

    if (!userId || !amount || Number(amount) <= 0) {
        return res.status(400).json({
            message: "Valid userId and amount are required.",
        });
    }

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

            const balanceAfter = Number(
                (balanceBefore - Number(amount)).toFixed(2)
            );

            await wallet.update(
                { balance: balanceAfter },
                { transaction }
            );

            const payment = await WalletTransaction.create(
                {
                    userId,
                    bookingId: bookingId || null,
                    type: "payment",
                    amount,
                    description:
                        description ||
                        `Payment for booking #${bookingId}`,
                    balanceBefore,
                    balanceAfter,
                },
                { transaction }
            );

            return {
                payment,
                balanceBefore,
                balanceAfter,
            };
        });

    } catch (error) {

        if (error.status === 400) {
            return res.status(400).json({
                message: error.message,
                shortfall: error.shortfall,
            });
        }

        throw error;
    }

    sendNotification({
        recipientId: userId,
        recipientRole: "user",
        type: "PAYMENT_SUCCESS",
        message: `Payment of Rs. ${amount} completed successfully.`,
        data: {
            bookingId,
            amount,
            balanceBefore: result.balanceBefore,
            balanceAfter: result.balanceAfter,
        },
    }).catch((err) => {
        console.error("Notification Service:", err.message);
    });

    res.status(200).json({
        message: "Payment successful.",
        transactionId: result.payment.id,
        balanceAfter: result.balanceAfter,
    });
};

const refund = async (req, res) => {

    const { userId, amount, bookingId, description } = req.body;

    if (!userId || !amount || Number(amount) <= 0) {
        return res.status(400).json({
            message: "Valid userId and amount are required.",
        });
    }

    const result = await sequelize.transaction(async (transaction) => {

        const [wallet] = await Wallet.findOrCreate({
            where: { userId },
            defaults: { balance: 0 },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        const balanceBefore = Number(wallet.balance);

        const balanceAfter = Number(
            (balanceBefore + Number(amount)).toFixed(2)
        );

        await wallet.update(
            { balance: balanceAfter },
            { transaction }
        );

        const refund = await WalletTransaction.create(
            {
                userId,
                bookingId: bookingId || null,
                type: "refund",
                amount,
                description:
                    description ||
                    `Refund for booking #${bookingId}`,
                balanceBefore,
                balanceAfter,
            },
            { transaction }
        );

        return {
            refund,
            balanceBefore,
            balanceAfter,
        };
    });

    sendNotification({
        recipientId: userId,
        recipientRole: "user",
        type: "PAYMENT_REFUND",
        message: `Refund of Rs. ${amount} has been credited to your wallet.`,
        data: {
            bookingId,
            amount,
            balanceBefore: result.balanceBefore,
            balanceAfter: result.balanceAfter,
        },
    }).catch((err) => {
        console.error("Notification Service:", err.message);
    });

    res.status(200).json({
        message: "Refund successful.",
        transactionId: result.refund.id,
        balanceAfter: result.balanceAfter,
    });
};

module.exports = { charge, refund };