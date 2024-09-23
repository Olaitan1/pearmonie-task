"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "user_id");
  },
};
