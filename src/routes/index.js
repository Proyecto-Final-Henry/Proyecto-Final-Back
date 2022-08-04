const { Router } = require("express");
const { Op } = require("sequelize");
const { Users } = require("../db");
const { Songs } = require("../db");
const axios = require("axios");
const { API_KEY } = process.env;
const { registrar, confirmar, autenticar, perfil, sendEmailContact } = require("./Funciones.js");
const { checkAutenticacion } = require("../middelwear/authMiddelwear");

const discogsRouter = require("./discogs-routes");
const genresRouter = require("./genres/genres-routes");
const artistsRouter = require("./artists/artists-routes");
const albumsRouter = require("./albums/albums-routes");

const router = Router();

router.use("/discogs", discogsRouter);

router.post("/register", registrar);

router.get("/confirmar/:token", confirmar);

router.post("/login", autenticar);

router.post("/sendEmailContact", sendEmailContact);

router.get("/perfil", checkAutenticacion, perfil);


// Routes of Genres
router.get("/genres", genresRouter);
router.get("/genresartists", genresRouter);
// Routes of Artists
router.get("/artists", artistsRouter);
router.get("/artistsongs", artistsRouter);
router.get("/artistsongstop", artistsRouter);

// Routes of Artists
router.get("/albums", albumsRouter);
router.get("/albumsongs", albumsRouter);

module.exports = router;
