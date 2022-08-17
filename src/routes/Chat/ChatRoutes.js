const express = require("express")
const { crearChat, userChats, findChat } = require("./ChatFunctions.js")

const chatRoutes = express.Router()

chatRoutes.post("/" , crearChat)

chatRoutes.get("/:userId" , userChats)

chatRoutes.get("/find/:firstId/:secondId", findChat)





module.exports = chatRoutes