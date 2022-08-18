const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "artist",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: `https://i.pinimg.com/564x/66/d0/40/66d040ade1199526ea244463b2d3356b.jpg`,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isTop: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      apiId: {
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: false }
  );
};
