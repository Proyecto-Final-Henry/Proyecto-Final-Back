const express = require("express");
const router = express.Router();
const { getsearch, getSearchDb,getArtistSongs, limit } = require("./search-functions");

router.get("/", async (req, res) => {
    const { query, index, filter } = req.query;
    try {
        if (query) {
            const result = await getsearch(query,index,filter);
            res.status(200).json(result);
        } else {
            const result = {
                data:[],
                total:0,
                prev:undefined,
                next:undefined,
                limit: limit
            }
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
    }

})
router.get("/track", async (req, res) => {
    const {query, limit} = req.query;
    try {
        if (query) {
            const result = await getArtistSongs(query,limit);
            res.status(200).json(result);
        } else {
            const result = {
                data:[],
                total:0,
                prev:undefined,
                next:undefined,
                limit: limit
            }
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
    }

})

router.get("/db", async (req, res, next) => {

    const { id, type } = req.query;
    try {

        const result = await getSearchDb(id, type, next);
        res.send(result);

    } catch (error) {
        next(error);
    }
})

module.exports = router;