const express = require("express");
const router = express.Router();
const { getsearch, getSearchDb,getArtistSongs,filterSearch, limit } = require("./search-functions");

router.get("/", async (req, res) => {
    const { query, index, filter, artist, album, explicit } = req.query;
    const obj={
        artist:artist,
        album:album,
        explicit:explicit
    }
    try {
        if (query) {
            const result = await getsearch(query,index,filter,obj);
            const result2 = filterSearch(result,obj)
            //console.log(result2)
            res.status(200).json(result2);
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
});

module.exports = router;