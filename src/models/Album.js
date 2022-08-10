const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "album",
    {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue:`https://i.pinimg.com/564x/66/d0/40/66d040ade1199526ea244463b2d3356b.jpg`
      },
      release_date: {
        type: DataTypes.STRING,
      },
      apiId: {
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: false }
  );
};
