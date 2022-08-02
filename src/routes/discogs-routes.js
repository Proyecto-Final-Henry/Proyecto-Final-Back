const express = require("express");
const router = express.Router();

const searchAny = require("./");

router.get("/search", async (req, res) => {
  const { query } = req.query;
  const result = await searchAny(query);
  res.json(result);
});

module.exports = router;
