'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.transaction(async transaction => {
      await Promise.all([
        queryInterface.addColumn('Users', 'jwt_valid_from', {
          type: Sequelize.DATE,
          allowNull: true
        }, { transaction })
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'password_hash')
  }
};
