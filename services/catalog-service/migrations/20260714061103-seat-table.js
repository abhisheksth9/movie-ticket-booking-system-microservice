'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('seats', { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      theaterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Theaters', key: 'id' },
        onDelete: 'CASCADE',
      },
      seatNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('standard', 'premium', 'vip'),
        defaultValue: 'standard',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }, });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('seats');
  }
};
