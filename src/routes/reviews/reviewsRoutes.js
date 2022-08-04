const { Router } = require("express");
const { crear } = require("./FuncionesReviews.js");
const router = Router();

router.post("/create", crear)

module.exports = router;