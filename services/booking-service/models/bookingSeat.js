'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BookingSeat extends Model {
        static associate(models) {
            BookingSeat.belongsTo(models.Booking, { foreignKey: 'bookingId' });
        }
    }

    BookingSeat.init({
        bookingId: { type: DataTypes.INTEGER, allowNull: false },
        seatId:    { type: DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        modelName: 'BookingSeat',
        tableName: 'booking_seats',
    });

    return BookingSeat;
};