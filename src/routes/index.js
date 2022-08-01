const { Router } = require('express');
const { Op } = require ("sequelize")
const { Users } = require ("../db")
const { Songs } = require ("../db")
const axios = require("axios");
const { API_KEY } = process.env;

const router = Router();

router.get("/videogames", async (req, res, next) => {

});

module.exports = router;