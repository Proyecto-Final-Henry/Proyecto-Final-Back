const { Artist } = require("./../../db.js");

async function registerArtist(name, apiId) {
  try {
    const [artist, created] = await Artist.findOrCreate({
      where: { name: name, apiId: apiId },
    });
    return { artist, created };
  } catch (err) {
    console.log(err);
  };
};

module.exports = registerArtist;
