const express = require("express");
const router = express.Router();

const { search } = require("./music-functions");

router.get("/search", async (req, res) => {
  try {
    const { query, filter } = req.query;
    const result = await search(query, filter);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  };
});

module.exports = router;
