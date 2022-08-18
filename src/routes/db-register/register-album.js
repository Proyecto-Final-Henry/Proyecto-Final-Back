const { Album } = require("./../../db.js");

async function registerAlbum(name, apiId) {
  try {
    const [album, created] = await Album.findOrCreate({
      where: { title: name, apiId: apiId },
    });
    return { album, created };
  } catch (err) {
    console.log(err);
  }
}

module.exports = registerAlbum;
