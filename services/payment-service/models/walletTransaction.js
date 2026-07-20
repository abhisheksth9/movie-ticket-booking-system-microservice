'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class WalletTransaction extends Model {
        static associate(models) {
            // User (Auth Service) is cross-service — no direct association.
            // userId stays a plain integer below.
        }
    }

    WalletTransaction.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('topup', 'payment', 'refund'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        balanceBefore: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        balanceAfter: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        // Links a payment/refund back to the booking that caused it —
        // null for plain top-ups, which have no associated booking.
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'WalletTransaction',
        tableName: 'wallet_transactions',
    });

    return WalletTransaction;
};