module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('booking_seats', 'showtimeId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE booking_seats bs
      JOIN bookings b ON bs.bookingId = b.id
      SET bs.showtimeId = b.showtimeId
    `);

    await queryInterface.changeColumn('booking_seats', 'showtimeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addConstraint('booking_seats', {
      fields: ['showtimeId', 'seatId'],
      type: 'unique',
      name: 'unique_showtime_seat',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint('booking_seats', 'unique_showtime_seat');
    await queryInterface.removeColumn('booking_seats', 'showtimeId');
  },
};