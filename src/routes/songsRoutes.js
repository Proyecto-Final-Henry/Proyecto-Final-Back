const { Router } = require("express");
const { registrar, confirmar, autenticar, perfil } = require("./FuncionesUsers.js");
const { checkAutenticacion } = require("../middelwear/authMiddelwear");
const discogsRouter = require("./music/music-routes");

const router = Router();

router.use("/discogs", discogsRouter);

router.post("/register", registrar);

router.get("/confirmar/:token", confirmar);

router.post("/login", autenticar);

router.get("/perfil", checkAutenticacion, perfil);


module.exports = router;
