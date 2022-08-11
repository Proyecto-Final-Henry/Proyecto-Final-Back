const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      }
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: true
    },
    show: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    } 
  }, {timestamps: false});
};