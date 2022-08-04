const { Router } = require("express");
const { Op } = require("sequelize");
const { Users } = require("../db");
const { Songs } = require("../db");
const axios = require("axios");
const { API_KEY } = process.env;

const discogsRouter = require("./discogs-routes");
const reviewRouter = require("./reviews")
const userRoute = require("./user")

const router = Router();

router.use("/discogs", discogsRouter);
router.use("/reviews", reviewRouter)
router.use("/user", userRoute)

module.exports = router;
