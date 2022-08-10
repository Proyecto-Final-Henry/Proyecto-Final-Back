const { Router } = require("express");
const router = Router();
const { createPlaylist, getAllPlaylist, addSongs, removeSongs, getPlaylist, editPlaylist } = require("./playlist-functions")

router.post("/create", createPlaylist )

router.get("/", getAllPlaylist)

router.put("/addSongs/:playlistId", addSongs)

router.put("/removeSongs/:playlistId", removeSongs)

router.get("/:id", getPlaylist)

router.put("/edit/:id", editPlaylist)

module.exports = router;