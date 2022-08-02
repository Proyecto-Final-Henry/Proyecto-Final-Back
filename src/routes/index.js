const { Router } = require("express");
const { Op } = require("sequelize");
const { Users } = require("../db");
const { Songs } = require("../db");
const axios = require("axios");
const { API_KEY } = process.env;
const { registrar, confirmar, autenticar, perfil } = require("./Funciones.js");
const { checkAutenticacion } = require("../middelwear/authMiddelwear");
const discogsRouter = require("./discogs-routes.js");

const router = Router();

router.use("/discogs", discogsRouter);

router.post("/register", registrar);

router.get("/confirmar/:token", confirmar);

router.post("/login", autenticar);

router.get("/perfil", checkAutenticacion, perfil);

module.exports = router;
