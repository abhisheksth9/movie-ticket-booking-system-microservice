'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('movies', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      language: {
        type: Sequelize.INTEGER,
        type: Sequelize.ENUM('English', 'Nepali', 'Hindi'),
        defaultValue: 'English',
      },
      createdAt: {type: Sequelize.DATE, allowNull:false},
      updatedAt: {type: Sequelize.DATE, allowNull:false}  
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('movies');
  }
};
