const { Song } = require("./../../db.js");

async function registerSong(name, apiId) {
  try {
    const [song, created] = await Song.findOrCreate({
      where: { name: name, apiId: apiId },
    });
    return { song, created };
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = registerSong;
