'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('seats', 'type');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('seats', 'type', {
      type: Sequelize.ENUM('STANDARD', 'PREMIUM', 'VIP'),
      allowNull: false,
      defaultValue: 'STANDARD',
    });
  },
};