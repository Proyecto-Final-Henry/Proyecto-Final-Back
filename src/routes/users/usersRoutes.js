<<<<<<< HEAD:src/routes/users/usersRoutes.js
const express = require("express");
const { registrar, confirmar, autenticar, perfil, sendEmailContact, olvidePassword, comprobarToken, nuevaPassword } = require("./FuncionesUsers.js");
const { checkAutenticacion } = require("../../middelwear/authMiddelwear");

const usersRoutes = express.Router();
=======
const express = require("express")
const { registrar, confirmar, autenticar, perfil, sendEmailContact, olvidePassword, comprobarToken, nuevaPassword, crearPagoMELI, baseApremium } = require("./FuncionesUsers.js");
const { checkAutenticacion } = require("../middelwear/authMiddelwear");


const usersRoutes = express.Router()
>>>>>>> d51537b9c0d6f513e9b38d851be7d20a12434fbb:src/routes/usersRoutes.js



usersRoutes.post("/create_preference" , checkAutenticacion, crearPagoMELI ); // tarjetas adentro de la funcion crearPagoMELI

usersRoutes.get(`/feedback/:id`, baseApremium )

usersRoutes.post("/register", registrar);

usersRoutes.get("/confirmar/:token", confirmar);

usersRoutes.post("/login", autenticar);

usersRoutes.post("/olvide-password", olvidePassword);

usersRoutes.get("/olvide-password/:token", comprobarToken);

usersRoutes.post("/olvide-password/:token", nuevaPassword);

usersRoutes.get("/perfil", checkAutenticacion, perfil);

usersRoutes.post("/sendEmailContact", sendEmailContact);

module.exports =  usersRoutes;

