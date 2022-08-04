
const express = require("express");
const router = express.Router();

const { getGenre,getGenres,getGenreArtists  } = require("./genres-functions");

router.get("/genres", async (req, res) => {
    const { genre } = req.query;
    try {
        if (genre) {
            const result = await getGenre(genre);
            res.status(200).json(result);
        } else {
            const result = await getGenres();
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
    }

});
router.get("/genresartists", async (req, res) => {
    const { genre } = req.query;
    try {
        if (genre) {
            const result = await getGenreArtists(genre);
            res.status(200).json(result);
        } else {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;