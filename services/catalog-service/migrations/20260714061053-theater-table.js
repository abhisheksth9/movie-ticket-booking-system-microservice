'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('theaters', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true},
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalSeats: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {type: Sequelize.DATE, allowNull:false},
      updatedAt: {type: Sequelize.DATE, allowNull:false}  
     });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('theaters');
  }
};
