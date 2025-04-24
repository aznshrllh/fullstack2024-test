"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  Client.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.CHAR(250),
        allowNull: false,
      },
      slug: {
        type: DataTypes.CHAR(100),
        allowNull: false,
      },
      is_project: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "0",
        validate: {
          isIn: [["0", "1"]],
        },
      },
      self_capture: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: "1",
      },
      client_prefix: {
        type: DataTypes.CHAR(4),
        allowNull: false,
      },
      client_logo: {
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: "no-image.jpg",
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.CHAR(50),
        allowNull: true,
      },
      city: {
        type: DataTypes.CHAR(50),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Client",
      tableName: "my_client",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true, // Enable soft deletes
    }
  );

  return Client;
};
