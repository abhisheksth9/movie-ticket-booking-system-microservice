'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('wallet_transactions', {
            id: {
                allowNull: true,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('topup', 'payment', 'refund'),
                allowNull: false,
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            balanceBefore: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            balanceAfter: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            bookingId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('wallet_transactions');
    },
};