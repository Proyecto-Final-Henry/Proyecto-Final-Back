const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("mensaje" , {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
         chatId : {
            type: DataTypes.STRING
         },
         senderId: {
            type: DataTypes.STRING
         },
         text : {
            type: DataTypes.STRING
         }
        }, {timestamps: true})
    }