'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
            Booking.hasMany(models.BookingSeat, { foreignKey: 'bookingId' });
        }
    }

    Booking.init({
        userId:     { type: DataTypes.INTEGER,       allowNull: false },
        showtimeId: { type: DataTypes.INTEGER,       allowNull: false },
        status:     { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
        totalPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    }, {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings',
    });
    return Booking;
};