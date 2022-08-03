const { DataTypes, Sequelize } = require('sequelize');
const { generarId } = require ("../helpers/generarId.js");
const bcrypt = require ("bcrypt");

module.exports = (sequelize) => {
  sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: { // hay que guardar la password hasheada e idealmente con un salt
      type: DataTypes.STRING,
      allowNull: false
    },
    userImg: {
      type: DataTypes.STRING,
      defaultValue:`https://cdn.pixabay.com/photo/2020/05/02/07/32/gaming-5120169_960_720.jpg`
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
    confirmado : {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role: {
      type: DataTypes.ENUM("Base", "Premium", "Admin"),
      defaultValue: "Base"
    },
    createdDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  }, {timestamps: false});
};



