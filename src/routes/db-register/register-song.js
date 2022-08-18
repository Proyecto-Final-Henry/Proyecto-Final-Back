const { Song } = require("./../../db.js");

async function registerSong(name, apiId) {
  try {
    const [song, created] = await Song.findOrCreate({
      where: { title: name, apiId: apiId },
    });
    return { song, created };
  } catch (err) {
      console.log(err);
  };
};

module.exports = registerSong;
