const { Router } = require("express");
const { registrar, confirmar, autenticar, perfil } = require("./FuncionesUsers.js");
const { checkAutenticacion } = require("../middelwear/authMiddelwear");
const discogsRouter = require("./music/music-routes");

const router = Router();

router.use("/discogs", discogsRouter);

module.exports = router;
