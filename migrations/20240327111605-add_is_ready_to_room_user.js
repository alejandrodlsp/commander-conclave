'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.transaction(async transaction => {
      await Promise.all([
        queryInterface.addColumn('RoomUsers', 'deck_id', {
          type: Sequelize.INTEGER,
          allowNull: true
        }, { transaction })
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('RoomUsers', 'deck_id')
  }
};
