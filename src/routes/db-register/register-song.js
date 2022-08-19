const { Song } = require("./../../db.js");
const axios = require("axios");

async function registerSong(name, apiId) {
  try {
    let result = await axios.get(`https://api.deezer.com/track/${apiId}`);
    let apiSong = {
      preview: result.data.preview,
      duration: result.data.duration,
      img: result.data.album.cover_big,
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
    return { song, created };
  } catch (err) {
    console.log(err);
  }
}

module.exports = registerSong;
