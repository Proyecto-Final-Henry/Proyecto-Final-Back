const { Mensaje } = require("../../db.js")
const { Op } = require ("sequelize");

const addMensaje = async (req,res) => {
    const { chatId, senderId, text } = req.body
    try {
        const chat = await Mensaje.create({chatId,senderId,text})
        res.json(chat)
    } catch (error) {
        return res.status(500).json(error)
    }
}


const getMensaje = async (req,res) => {
    const { chatId } = req.params

    try {
        const chat = await Mensaje.findAll({where: { chatId : chatId }})
        res.json(chat)
    } catch (error) {
        return res.status(500).json(error)
    }


}


module.exports = {
    addMensaje,
    getMensaje
}