const { Song } = require("./../../db.js");

async function registerSong(
  name,
  album,
  releaseDate,
  duration,
  description,
  apiId
) {
  try {
    const [song, created] = await Song.findOrCreate({
      where: { name: name },
      defaults: {
        apiId,
        album,
        releaseDate,
        duration,
        description,
      },
    });
    return { song, created };
  } catch (err) {
    throw new Error("Error al registrar canción");
  }
}
