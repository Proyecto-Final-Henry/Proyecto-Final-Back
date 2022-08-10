const axios = require("axios");
const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;

async function search(query, filter) {
  if (filter === "track") {
    try {
      const response = await axios.get(
        `https://api.discogs.com/database/search?${filter}=${query}&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}&page=1&per_page=10`
      );
      let results = response.data.results.map((t) => {
        return {
          title: t.title,
          thumb: t.thumb,
          id: t.id,
        };
      });
      return results;
    } catch (err) {
      throw new Error("¡No encontramos esa canción!");
    }
  } else if (filter === "artist" || filter === "master") {
    try {
      const response = await axios.get(
        `https://api.discogs.com/database/search?q=${query}&type=${filter}&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}&page=1&per_page=10`
      );
      let results = response.data.results.map((r) => {
        return {
          title: r.title,
          thumb: r.thumb,
          id: r.id,
        };
      });
      return results;
    } catch (err) {
      throw new Error("¡No encontramos lo que buscas!");
    }
  } else {
    try {
      const response = await axios.get(
        `https://api.discogs.com/database/search?q=${query}&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}&page=1&per_page=20`
      );
      let results = response.data.results.filter((t) => {
        return t.type === "artist" || t.type === "master";
      });
      results = results.map((r) => {
        return {
          title: r.title,
          thumb: r.thumb,
          id: r.id,
          type: r.type,
        };
      });
      return results;
    } catch (err) {
      throw new Error("¡No encontramos lo que buscas!");
    }
  }
}

async function getRandomSongs(req, res, next) {
  try {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    };

    let songs = [];
    let count = 0;

    do {
      count++;
      const random = getRandomInt(230000, 320000);
      const result = await axios.get(`https://api.deezer.com/track/${random}`);

  } catch (error) {
    next(error);
  }
}

async function getSongDetail(req, res, next) {
  const songId = req.query.id;
  if (!songId) {
    return res.json({ error: "Id de canción es necesario" });
  } else {
    try {
      let result = await axios.get(`https://api.deezer.com/track/${songId}`);
      let song = {
        id: result.data.id,
        title: result.data.title,
        preview: result.data.preview,
        duration: result.data.duration,
        artist: result.data.artist.name,
        artistId: result.data.artist.id,
        img: result.data.album.cover_big,
        album: result.data.album.title,
        albumId: result.data.album.id,
      };
      return res.json(song);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { search, getRandomSongs, getSongDetail };