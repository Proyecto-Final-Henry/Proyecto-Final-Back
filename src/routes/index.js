const { Router } = require('express');
const { Op } = require ("sequelize")
const { Users } = require ("../db")
const { Songs } = require ("../db")
const axios = require("axios");
const { API_KEY } = process.env;
const { registrar , confirmar , autenticar} = require("./Funciones.js")

const router = Router();

router.post("/register", registrar);

router.get("/confirmar/:token" , confirmar)

router.post("/login" , autenticar)


module.exports = router;