const { DataTypes, Sequelize } = require('sequelize');
const { generarId } = require ("../helpers/generarId.js")

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
    password: {
      type: DataTypes.STRING,
      allowNull: false
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
    isPremium:{
      type: DataTypes.BOOLEAN,
      // allowNull: false,
      defaultValue: false,
    },
    isPromoter:{
      type: DataTypes.BOOLEAN,
      // allowNull: false,
      defaultValue: false,
    },
    isAdmin:{
      type: DataTypes.BOOLEAN,
      // allowNull: false,
      defaultValue: false,
    },
  }, {timestamps: false});
};
