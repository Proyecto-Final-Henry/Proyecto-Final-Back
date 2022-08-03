const express = require("express");
const router = express.Router();

const { searchAny } = require("./discogs-functions");

router.get("/search", async (req, res) => {
  const { name } = req.query;
  const result = await searchAny(name);
  res.json(result);
});

module.exports = router;
