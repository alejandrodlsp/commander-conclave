'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.transaction(async transaction => {
      await Promise.all([
        queryInterface.changeColumn('Users', 'username', {
            type: Sequelize.STRING,
            allowNull: false,
        }, { transaction }),
        queryInterface.changeColumn('Users', 'email', {
          type: Sequelize.STRING,
          allowNull: false,
        }, { transaction }),
        queryInterface.addColumn('Users', 'password_hash', {
          type: Sequelize.STRING,
          allowNull: false,
        }, { transaction })
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'password_hash')
  }
};
