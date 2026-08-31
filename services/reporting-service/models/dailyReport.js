'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DailyReport extends Model {
    static associate(models) {
      // associations
    }
  }

  DailyReport.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true
    },
    newUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    logins: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    deletions: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bookingsCreated: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bookingsCancelled: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    paymentsProcessed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    refundsIssued: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalRefunded: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    walletTopups: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalTopupAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    generatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reportFileKey: { 
        type: DataTypes.STRING, 
        allowNull: true 
    }
  }, {
    sequelize,
    modelName: 'DailyReport',
    tableName: 'daily_reports',
  });

  return DailyReport;
};