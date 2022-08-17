const express = require("express")
const { getMensaje, addMensaje } = require("./MensajesFunctions.js")

const mensajeRoutes = express.Router()

mensajeRoutes.post("/" , addMensaje)

mensajeRoutes.get("/:chatId" , getMensaje)


module.exports = mensajeRoutes