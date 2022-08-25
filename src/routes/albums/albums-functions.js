const axios = require("axios");
const { Op } = require ("sequelize");
const { Album, Genre } = require ("../../db.js");

async function getAlbum(id) {
  try {
    const response = await axios.get(`https://api.deezer.com/album/${id}`)
                            .then(response => {
                                return{
                                  id : response.data.id,
                                  title: response.data.title,
                                  image : response.data.cover_big,
                                  idgenre : response.data.genre_id,
                                  duration : response.data.duration,
                                  artist : {idartist : response.data.artist.id, nameartist : response.data.artist.name, imageartist : response.data.artist.picture_big}
                                }
                            });
    return response;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};

async function getAlbumSongs(id) {
  try {
    const response = await axios.get(`https://api.deezer.com/album/${id}/tracks`)
                      .then(response => {
                        return response.data.data.map(item => {
                          return{
                              id : item.id,
                              title: item.title,
                              duration : item.duration,
                              preview : item.preview,
                              artist : {idArtist: item.artist.id, nameArtist: item.artist.name}
                          };
                      });
                    });
    return response;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};

async function createAlbums(req, res, next) {
  try {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    };

    let AlbumFind = await Album.findAll({include: Genre}); //{include: Genre}

    if (!AlbumFind.length) {
      for (let i = 0; i < 200; i++) {
        const random = getRandomInt(100000, 999999);
        const response = await axios.get(`https://api.deezer.com/album/${random}`);
        if (response.data.title) {
          let newAlbum = await Album.create({
            apiId: response.data.id,
            title: response.data.title,
            duration : response.data.duration,
            image : response.data.cover_big,
            release_date: response.data.cover_big,
          });

          if (response.data.genres.data) {
            let genreMap = response.data.genres.data.map(g => g.name);
            if (genreMap) {
              for (let i = 0; i < genreMap.length; i++) {
                let genreDB = await Genre.findOne({ where: { name: genreMap[i] } });
                await newAlbum.addGenres(genreDB);
              };
            };
          };
        };
      };
      let newAlbums = await Album.findAll({include: Genre});
      return res.json(newAlbums);
    } else {
      return res.json(AlbumFind);
    }
  } catch (error) {
    next(error);
  };
};

async function getAlbums(req, res, next) {
  try {
    let AllAlbums = await Album.findAll({include: Genre});
    return res.json(AllAlbums);
  } catch (error) {
    next(error);
  };
};

async function getgenres(req, res, next) {
  let { genre } = req.params;

  if (genre === "Rap" || genre === "Hip%20Hop") {
    genre = "Rap/Hip Hop"
  };

  if (genre === "Película" || genre === "Juegos" || genre === "Movies" || genre === "Games") {
    genre = "Películas/Juegos"
  };

  if (genre === "Classical") {
    genre = "Clásica"
  };

  if (genre === "Techno" || genre === "House") {
    genre = "Techno/House"
  };

  if (genre === "Techno" || genre === "House") {
    genre = "Techno/House"
  };

  if (genre === "Brazilian Music") {
    genre = "Música Brasileña"
  };

  if (genre === "African Music") {
    genre = "Música Africana"
  };

  if (genre === "Asian Music") {
    genre = "Música Asiática"
  };
  
  if (genre === "Indian Music") {
    genre = "Música de La India"
  };

  let genreFind = await Album.findAll({
    include: {
      model: Genre,
      where: {
        name: genre
      }
    }
  });
  try {
    return res.json(genreFind);
  } catch (error) {
    next(error);
  };
};

module.exports = { getAlbum, getAlbumSongs, createAlbums, getAlbums, getgenres };
