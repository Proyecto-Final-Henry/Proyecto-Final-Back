const { Router } = require('express');
const { Op } = require ("sequelize")
const { Users } = require ("../db")
const { Songs } = require ("../db")
const axios = require("axios");
const { API_KEY } = process.env;

const router = Router();

router.get("/users", async (req, res, next) => {
    res.send({msg:"Hola!"})

});

module.exports = router;