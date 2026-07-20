'use strict';
const { Model } = require('sequelize');

// Seat here = physical layout (row, number, tier) belonging to a Theater.
// This is NOT reservation status — whether a seat is taken for a specific
// showtime is tracked separately, later, in Booking Service.
module.exports = (sequelize, DataTypes) => {
    class Seat extends Model {
        static associate(models) {
            Seat.belongsTo(models.Theater, { foreignKey: 'theaterId' });
        }
    }

    Seat.init({
        theaterId:  { type: DataTypes.INTEGER, allowNull: false },
        seatNumber: { type: DataTypes.STRING,  allowNull: false },
        type: {
            type: DataTypes.ENUM('vip', 'premium', 'standard'),
            allowNull: false,
            defaultValue: 'standard',
        },
    }, {
        sequelize,
        modelName: 'Seat',
        tableName: 'seats',
    });

    return Seat;
};
