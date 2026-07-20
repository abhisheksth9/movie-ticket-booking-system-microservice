'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Wallet extends Model {
        static associate(models) {
            // No local association to User — it lives in Auth Service's DB.
        }
    }

    Wallet.init({
        userId:  { type: DataTypes.INTEGER, allowNull: false, unique: true },
        balance: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
    }, {
        sequelize,
        modelName: 'Wallet',
        tableName: 'wallets',
    });

    return Wallet;
};