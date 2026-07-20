'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Showtime extends Model {
        static associate(models) {
            Showtime.belongsTo(models.Movie,   { foreignKey: 'movieId' });
            Showtime.belongsTo(models.Theater, { foreignKey: 'theaterId' });
            // Booking lives in Booking Service's own database — no direct
            // Sequelize association possible across services. Booking
            // Service stores showtimeId as a plain integer and calls this
            // service's API when it needs showtime details.
        }
    }

    Showtime.init({
        movieId:   { type: DataTypes.INTEGER,       allowNull: false },
        theaterId: { type: DataTypes.INTEGER,       allowNull: false },
        startTime: { type: DataTypes.DATE,          allowNull: false },
        endTime:   { type: DataTypes.DATE,          allowNull: false },
        price:     { type: DataTypes.DECIMAL(10,2), allowNull: false },
    }, {
        sequelize,
        modelName: 'Showtime',
        tableName: 'showtimes',
    });

    return Showtime;
};