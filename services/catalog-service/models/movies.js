'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Movie extends Model {
        static associate(models) {
            Movie.hasMany(models.Showtime, { foreignKey: 'movieId' });
        }
    }

    Movie.init({
        title:       { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        duration:    { type: DataTypes.INTEGER, allowNull: false },
        genre:       { type: DataTypes.STRING },
        language:    { type: DataTypes.STRING, defaultValue: 'English' },
    }, {
        sequelize,
        modelName: 'Movie',
        tableName: 'movies',
    });

    return Movie;
};

