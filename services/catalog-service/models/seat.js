'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Seat extends Model {
        static associate(models) {
            Seat.belongsTo(models.Theater, { foreignKey: 'theaterId' });
        }
    }

    Seat.init({
        theaterId:  { type: DataTypes.INTEGER, allowNull: false },
        seatNumber: { type: DataTypes.STRING,  allowNull: false },
    }, {
        sequelize,
        modelName: 'Seat',
        tableName: 'seats',
    });

    return Seat;
};
