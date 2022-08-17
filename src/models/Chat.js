const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("chat" , {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
          members : {
            type: DataTypes.ARRAY(DataTypes.STRING)
          },
        }, {timestamps: true})
    }
