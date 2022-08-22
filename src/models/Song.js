const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "song",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fixAlbumId: {
        type: DataTypes.INTEGER,
      },
      apiId: {
        type: DataTypes.INTEGER,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: `https://i.pinimg.com/564x/66/d0/40/66d040ade1199526ea244463b2d3356b.jpg`,
      },
      preview: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: false }
  );
};
