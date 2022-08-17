const { Chat } = require("../../db.js")
const { Op } = require ("sequelize");

const crearChat = async (req,res) => {
    const { senderId , reciverId } = req.body

    const chatExistente = await Chat.findOne({ where : {members : {[Op.contains] : [senderId,reciverId]}}})
    if(chatExistente){
        return res.json(chatExistente)
    }

    try {
        const newChat = await Chat.create({ members : [senderId,reciverId]})
        res.status(200).json(newChat)
    } catch (error) {
        return res.status(500).json(error)
    }
}


const userChats = async ( req, res) => {
    const { userId } = req.params
    try {
        const chat = await Chat.findAll({ where : {members: {[Op.contains]: [userId]}}})
        res.status(200).json(chat)
    } catch (error) {
        return res.status(500).json(error)
    }
}


const findChat = async (req,res) => {
    const { firstId , secondId } = req.params

    try {
        const chat = await Chat.findOne({ where : {members : {[Op.contains] : [firstId,secondId]}}})
        res.status(200).json(chat)
    } catch (error) {
        return res.status(500).json(error)
    }
}


module.exports = {
    crearChat,
    userChats,
    findChat
}