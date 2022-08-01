const { Router } = require('express');
const { Op } = require ("sequelize")
const { Users } = require ("../db")
const { Songs } = require ("../db")
const axios = require("axios");
const { API_KEY } = process.env;
const { registrar } = require("./Funciones.js")

const router = Router();

router.post("/", registrar)


module.exports = router;