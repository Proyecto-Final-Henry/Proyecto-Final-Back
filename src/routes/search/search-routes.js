const express = require("express");
const router = express.Router();
const { getsearch } = require("./search-functions");

router.get("/", async (req, res) => {
    const { query, index, filter } = req.query;
    try {
        if (query) {
            const result = await getsearch(query,index,filter);
            res.status(200).json(result);
        } else {
            const result = await getsearch("");
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
    }

})

module.exports = router;