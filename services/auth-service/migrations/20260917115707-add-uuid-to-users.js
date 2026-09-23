'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'uuid', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    const [users] = await queryInterface.sequelize.query('SELECT id FROM users');
    for (const user of users) {
      await queryInterface.sequelize.query(
        'UPDATE users SET uuid = :uuid WHERE id = :id',
        { replacements: { uuid: uuidv4(), id: user.id } }
      );
    }

    await queryInterface.changeColumn('users', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
    });
    await queryInterface.addConstraint('users', {
      fields: ['uuid'],
      type: 'unique',
      name: 'users_uuid_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'uuid');
  },
};