const { Router } = require("express");
const { crear, modificar, getReview } = require("./reviews-functions");
const router = Router();

router.post("/create", crear)

router.put("/:id", modificar)

router.get("/:id", getReview)

module.exports = router;