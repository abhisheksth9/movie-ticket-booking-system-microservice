const { Wallet, WalletTransaction, sequelize } = require("../../models");

const authClient = require("../utils/authClient");
const { sendNotification } = require("../utils/notificationService");

const topUpWallet = async (req, res) => {

    const { targetUserId, amount } = req.body;

    if (!targetUserId || !amount || Number(amount) <= 0) {
        return res.status(400).json({
            message: "Valid targetUserId and amount are required.",
        });
    }

    const user = await authClient.getUser(targetUserId, req.user);
    if (!user) {
        return res.status(404).json({
            message: "User not found.",
        });
    }

    const result = await sequelize.transaction(async (transaction) => {
        const [wallet] = await Wallet.findOrCreate({
            where: {
                userId: targetUserId,
            },
            defaults: {
                balance: 0,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        const balanceBefore = Number(wallet.balance);

        const balanceAfter = Number(
            (balanceBefore + Number(amount)).toFixed(2)
        );

        await wallet.update(
            {
                balance: balanceAfter,
            },
            {
                transaction,
            }
        );

        const transactionRecord = await WalletTransaction.create(
            {
                userId: targetUserId,
                type: "topup",
                amount,
                description: `Wallet topped up with Rs. ${amount}`,
                balanceBefore,
                balanceAfter,
            },
            { transaction }
        );
        return { transactionRecord,};
    });

    try {
        await Promise.all([
            sendNotification({
                recipientId: targetUserId,
                recipientRole: "user",
                type: "WALLET_TOPUP",
                message: `Rs. ${amount} has been added to your wallet.`,
                data: {
                    amount,
                    balanceBefore: result.transactionRecord.balanceBefore,
                    balanceAfter: result.transactionRecord.balanceAfter,
                },
            }),

            sendNotification({
                recipientRole: "admin",
                type: "ADMIN_WALLET_TOPUP",
                message: `${req.user.name} topped up Rs. ${amount} to ${user.name}'s wallet.`,
                data: {
                    adminId: req.user.id,
                    adminName: req.user.name,
                    targetUserId,
                    targetUserName: user.name,
                    amount,
                    balanceBefore: result.transactionRecord.balanceBefore,
                    balanceAfter: result.transactionRecord.balanceAfter,
                },
            }),

        ]);
    } catch (err) {
        console.error("Notification Service:", err.message);
    }

    res.status(200).json({
        message: "Wallet topped up successfully.",
        userId: targetUserId,
        userName: user.name,
        balanceBefore: result.transactionRecord.balanceBefore,
        balanceAfter: result.transactionRecord.balanceAfter,
    });
};

const getBalance = async (req, res) => {
    const wallet = await Wallet.findOne({
        where: { userId: req.user.id },
    });

    res.status(200).json({
        userId: req.user.id,
        balance: wallet ? Number(wallet.balance) : 0,
    });
};

const getTransactionHistory = async (req, res) => {
    const transactions = await WalletTransaction.findAll({
        where: {
            userId: req.user.id,
        },
        order: [["createdAt", "DESC"]],
        attributes: [
            "id",
            "type",
            "amount",
            "description",
            "balanceBefore",
            "balanceAfter",
            "bookingId",
            "createdAt",
        ],
    });
    res.status(200).json(transactions);
};

module.exports = { topUpWallet, getBalance, getTransactionHistory };