const express = require("express")
const { registrar, confirmar, autenticar, perfil, sendEmailContact } = require("./FuncionesUsers.js");
const { checkAutenticacion } = require("../middelwear/authMiddelwear");

const usersRoutes = express.Router()

usersRoutes.post("/register", registrar);

usersRoutes.get("/confirmar/:token", confirmar);

usersRoutes.post("/login", autenticar);

usersRoutes.get("/perfil", checkAutenticacion, perfil);

usersRoutes.post("/sendEmailContact", sendEmailContact);







module.exports =  usersRoutes 