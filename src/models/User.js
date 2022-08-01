const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('user', {
    id: {
<<<<<<< HEAD:src/models/Users.js
      type: DataTypes.INTEGER,
=======
      type: DataTypes.UUID,
>>>>>>> d4aeb753671b3988d5405aa96f2fb23ca1ea0782:src/models/User.js
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPremium:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isPromoter:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAdmin:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {timestamps: false});
};
