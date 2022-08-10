const express = require("express");
const router = express.Router();
const { getAlbum, getAlbumSongs, createAlbums, getAlbums } = require("./albums-functions");

router.get("/", async (req, res) => {
    const { album } = req.query;
    try {
        if (album) {
            const result = await getAlbum(album);
            res.status(200).json(result);
        } else {
            console.log(error);
        };
    } catch (error) {
        console.log(error);
    };
});

router.get("/albumsongs", async (req, res) => {
    const { album } = req.query;
    try {
        if (album) {
            const result = await getAlbumSongs(album);
            res.status(200).json(result);
        } else {
            console.log("error on album-routes");
        };
    } catch (error) {
        console.log(error);
    };
});

router.get("/create", createAlbums);

router.get("/getall", getAlbums);

module.exports = router;