const { Album } = require("./../../db.js");

async function registerArtist(name, apiId) {
  try {
    const [album, created] = await Album.findOrCreate({
      where: { name: name },
      defaults: {
        apiId: apiId,
      },
    });
    return { album, created };
  } catch (err) {
    throw new Error("Error al registrar artista");
  }
}

module.exports(registerArtist);
