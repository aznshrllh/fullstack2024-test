"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("my_client", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.CHAR(250),
        allowNull: false,
      },
      slug: {
        type: Sequelize.CHAR(100),
        allowNull: false,
      },
      is_project: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "0",
        validate: {
          isIn: [["0", "1"]],
        },
      },
      self_capture: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        defaultValue: "1",
      },
      client_prefix: {
        type: Sequelize.CHAR(4),
        allowNull: false,
      },
      client_logo: {
        type: Sequelize.CHAR(255),
        allowNull: false,
        defaultValue: "no-image.jpg",
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.CHAR(50),
        allowNull: true,
      },
      city: {
        type: Sequelize.CHAR(50),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("my_client");
  },
};
