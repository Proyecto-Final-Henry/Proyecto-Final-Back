const { Router } = require("express");
const {
  crear,
  modificar,
  getReview,
  getUserReview,
  getResourceReviews,
} = require("./reviews-functions");
const router = Router();

router.post("/create", crear);

router.put("/:id", modificar);

router.get("/resource", getResourceReviews);

router.get("/:id", getReview);

router.get("/", getReview);

router.get("/user/:id", getUserReview);

module.exports = router;
