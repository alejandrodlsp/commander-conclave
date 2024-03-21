'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(64)
    },
    jwt_valid_from: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};