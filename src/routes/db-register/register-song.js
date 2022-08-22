const { Song } = require("./../../db.js");
const registerArtist = require("./register-artist");
const registerAlbum = require("./register-album");
const axios = require("axios");

async function registerSong(name, apiId) {
  try {
    let result = await axios.get(`https://api.deezer.com/track/${apiId}`);
    let apiSong = {
      preview: result.data.preview,
      duration: result.data.duration,
      image: result.data.album.cover_big,
      artist: result.data.artist.name,
      artistId: result.data.artist.id,
      album: result.data.album.title,
      albumId: result.data.album.id,
    };
    const [song, created] = await Song.findOrCreate({
      where: {
        title: name,
        apiId: apiId,
        preview: apiSong.preview,
        duration: apiSong.duration,
        img: apiSong.img,
      },
    });
    const { album } = await registerAlbum(apiSong.album, apiSong.albumId);
    await album.addSong(song.id);
    const { artist } = await registerArtist(apiSong.artist, apiSong.artistId);
    await artist.addSong(song.id);
    return { song, created };
  } catch (err) {
    console.log(err);
  }
}

module.exports = registerSong;
