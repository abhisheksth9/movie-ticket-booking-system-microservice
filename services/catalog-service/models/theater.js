'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Theater extends Model {
        static associate(models) {
            // Seat = physical seat layout (row, number, tier) — lives here
            // alongside Theater since it rarely changes and describes the
            // venue itself, not a booking. Reservation status per showtime
            // is a separate concern that lives in Booking Service.
            Theater.hasMany(models.Seat,     { foreignKey: 'theaterId' });
            Theater.hasMany(models.Showtime, { foreignKey: 'theaterId' });
        }
    }

    Theater.init({
        name:       { type: DataTypes.STRING,  allowNull: false },
        location:   { type: DataTypes.STRING,  allowNull: false },
        totalSeats: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        modelName: 'Theater',
        tableName: 'theaters',
    });

    return Theater;
};