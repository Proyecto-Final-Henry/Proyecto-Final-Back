const { Router } = require("express");
const { crear } = require("./reviews-functions.js");
const router = Router();

router.post("/create", crear)

module.exports = router;