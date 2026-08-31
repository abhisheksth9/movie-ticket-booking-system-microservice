'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DailyReports', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      date: { type: Sequelize.DATEONLY, allowNull: false, unique: true },
      newUsers: { type: Sequelize.INTEGER, defaultValue: 0 },
      logins: { type: Sequelize.INTEGER, defaultValue: 0 },
      deletions: { type: Sequelize.INTEGER, defaultValue: 0 },
      bookingsCreated: { type: Sequelize.INTEGER, defaultValue: 0 },
      bookingsCancelled: { type: Sequelize.INTEGER, defaultValue: 0 },
      paymentsProcessed: { type: Sequelize.INTEGER, defaultValue: 0 },
      totalRevenue: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      refundsIssued: { type: Sequelize.INTEGER, defaultValue: 0 },
      totalRefunded: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      walletTopups: { type: Sequelize.INTEGER, defaultValue: 0 },
      totalTopupAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      generatedAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('DailyReports');
  }
};