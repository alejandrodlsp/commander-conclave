'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    acceptNewPlayer(currentUsers) {
      return this.status === "ACTIVE" && currentUsers.length < this.max_players
    }
  }
  Room.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'A room with this name already exists!'
      },
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
        notNull: { msg: "Name cannot be null" }
      }
    },
    description: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "ACTIVE", // ACTIVE, INACTIVE, IN_GAME
      allowNull: false,
      validate: {
        notEmpty: { msg: "Status cannot be empty" },
        notNull: { msg: "Status cannot be null" }
      }
    },
    max_players: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Max players cannot be empty" },
        notNull: { msg: "Max players cannot be null" }
      }
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};