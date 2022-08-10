const express = require("express");
const router = express.Router();
const { getArtist,getArtists,getArtistSongs,getArtistSongsTop,getArtistAlbums } = require("./artists-functions");

router.get("/", async (req, res) => {
    const { artist } = req.query;
    try {
        if (artist) {
            const result = await getArtist(artist);
            res.status(200).json(result);
        } else {
            const result = await getArtists();
            res.status(200).json(result);
        };
    } catch (error) {
        console.log(error);
    };

});
router.get("/artistsongs", async (req, res) => {
    const { artist, index } = req.query;
    try {
        if (artist) {
            const result = await getArtistSongs(artist, index);
            res.status(200).json(result);
        } else {
            console.log("error on artists-routes");
        };
    } catch (error) {
        console.log(error);
    };
});

router.get("/artistalbums", async (req, res) => {
    const { artist } = req.query;
    try {
        if (artist) {
            const result = await getArtistAlbums(artist);
            res.status(200).json(result);
        } else {
            console.log("error on artists-routes");
        };
    } catch (error) {
        console.log(error);
    };
});

router.get("/artistsongstop", async (req, res) => {
    const { artist } = req.query;
    try {
        if (artist) {
            const result = await getArtistSongsTop(artist);
            res.status(200).json(result);
        } else {
            console.log("error on artists-routes");
        }
    } catch (error) {
        console.log(error);
    };
});

module.exports = router;