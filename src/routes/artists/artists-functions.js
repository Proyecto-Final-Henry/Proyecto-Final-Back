const axios = require("axios");
const { Artist, Genre } = require ("../../db.js");
const limit = 20; // aqui se fija el limite de items a traer de la api

async function getArtist(id) {
  try {
    const response = await axios.get(`https://api.deezer.com/artist/${id}`)
                            .then(response => {
                                return{
                                  id : response.data.id,
                                  name: response.data.name,
                                  image : response.data.picture_big
                                }
                            });
    return response;
    // return response.data.data;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};

async function getArtists() {
  try {
    const response = await axios.get(`https://api.deezer.com/genre/0/artists`)
                            .then(response => {
                                return response.data.data.map(item => {
                                    return{
                                        id : item.id,
                                        name: item.name,
                                        image : item.picture_big
                                    }
                                })
                            })
    return response;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};

async function getArtistAlbums(id) {
  try {
    const response = await axios.get(`https://api.deezer.com/artist/${id}/albums`)
                      .then(response => {
                        return response.data.data.map(item => {
                          return{
                              id : item.id,
                              title: item.title,
                              genre_id: item.genre_id,
                              img: item.cover_big
                          };
                      });
                    });
    return response;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};
async function getArtistSongs(id,index) {
  try {
    const response = await axios.get(`https://api.deezer.com/artist/${id}/top?limit=${limit}&index=${index}`)
                      .then(response => {
                        let prev = undefined;
                        let next = undefined;
                        if (response.data.prev) {
                          prev = true;
                        }
                        if (response.data.next) {
                          next = true;
                        }
                        const pagination = {
                          total: response.data.total,
                          prev: prev,
                          next: next,
                          limit: limit,
                        };
                        return {
                          data: response.data.data.map(item => {
                              return{
                                  id : item.id,
                                  title: item.title,
                                  duration : item.duration,
                                  preview : item.preview,
                                  album : {idAlbum: item.album.id, titleAlbum : item.album.title, imageAlbum : item.album.cover_big}
                              };
                          }),
                          ...pagination
                        };
                    });
    return response;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};

async function getArtistSongsTop(id) {
  try {
    const response = await axios.get(`https://api.deezer.com/artist/${id}/top`)
                      .then(response => {
                        return response.data.data.map(item => {
                          return{
                              id : item.id,
                              title: item.title,
                              duration : item.duration,
                              preview : item.preview,
                              album : {idAlbum: item.album.id, titleAlbum : item.album.title, imageAlbum : item.album.cover_big}
                          };
                      });
                    });
    return response;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};

async function createArtists(req, res, next) {
  try {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    };

    let ArtistFind = await Artist.findAll(); //{include: Genre}

    if (!ArtistFind.length) {
      for (let i = 0; i < 20; i++) {
        const random = getRandomInt(100000, 999999);
        const response = await axios.get(`https://api.deezer.com/artist/${random}`);
        if (response.data.name) {
          let newArtist = await Artist.create({
            id: response.data.id,
            name: response.data.name,
            image : response.data.cover_big,
          });
          // No trae el genero de artistas
          // if (response.data.genres.data) {
          //   let genreMap = response.data.genres.data.map(g => g.name);
          //   if (genreMap) {
          //     for (let i = 0; i < genreMap.length; i++) {
          //       let genreDB = await Genre.findOne({ where: { name: genreMap[i] } });
          //       await newArtist.addGenres(genreDB);
          //     };
          //   };
          // };
        };
      };

      let newArtists = await Artist.findAll();
      return res.json(newArtists);
    } else {
      return res.json(ArtistFind);
    };
  } catch (error) {
    next(error);
  };
};

async function createTopArtists(req, res, next) {
  try {
    // let genreId = [];
    let topArtistFind = await Artist.findAll(); //{include: Genre}

    if (!topArtistFind.length) {
      for (let a = 0; a < 5; a++) {
        const response = await axios.get(`https://api.deezer.com/genre/${a}/artists`)
        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data) {
            let topArtist = await Artist.create({
              id: response.data.data[i].id,
              name: response.data.data[i].name,
              image : response.data.data[i].cover_big,
            });
          };
        };
      };
      let topArtists = await Artist.findAll();
      return res.json(topArtists);
    } else {
      return res.json(topArtistFind);
    };
  } catch (error) {
    next(error);
  };
};

module.exports = { getArtist, getArtists, getArtistSongs, getArtistSongsTop, getArtistAlbums, createArtists, createTopArtists };
