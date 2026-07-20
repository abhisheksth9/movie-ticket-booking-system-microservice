'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('showtimes', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true  
      },
      movieId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'movies', key: 'id' },
        onDelete: 'CASCADE',
      },
      theaterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'theaters', key: 'id' },
        onDelete: 'CASCADE',
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('showtimes');
  }
};
