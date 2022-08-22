const { DataTypes, Sequelize } = require("sequelize");
const { generarId } = require("../helpers/generarId.js");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userImg: {
        type: DataTypes.STRING,
        defaultValue: `https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360`,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      token: {
        type: DataTypes.STRING,
        defaultValue: generarId(),
      },
      confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM("Gratuito", "Premium", "Admin"),
        defaultValue: "Gratuito",
      },
      createdDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      eliminatedAt: {
        type: DataTypes.DATEONLY,
      },
    },
    { timestamps: true }
  );
};
