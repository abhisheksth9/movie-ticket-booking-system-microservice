'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // No associations yet
        }
    }

    User.init({
        uuid:     { type: DataTypes.STRING, allowNull: false, unique:true, defaultValue: () => uuidv4() },
        name:     { type: DataTypes.STRING, allowNull: false },
        email:    { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role:     { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
    });
    return User;
};