const express = require("express")
const { registrar, confirmar, autenticar, perfil } = require("./FuncionesUsers.js");
const { checkAutenticacion } = require("../middelwear/authMiddelwear");

const usersRoutes = express.Router()

usersRoutes.post("/register", registrar);

usersRoutes.get("/confirmar/:token", confirmar);

usersRoutes.post("/login", autenticar);




usersRoutes.get("/perfil", checkAutenticacion, perfil);









module.exports =  usersRoutes 