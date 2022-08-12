const { Router } = require("express");
const router = Router();
const { createPlaylist, getAllPlaylist, addSongs, removeSongs, getUserPlaylist, editPlaylist, deletePlaylist } = require("./playlist-functions")

router.post("/create", createPlaylist );

router.get("/", getAllPlaylist);

router.put("/addSongs/:playlistId", addSongs);

router.put("/removeSongs/:playlistId", removeSongs);

router.get("/:id", getUserPlaylist);

router.put("/edit/:id", editPlaylist);

router.put("/delete/:id", deletePlaylist);

module.exports = router;