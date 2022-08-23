const axios = require("axios");
const { Artist } = require ("../../db.js");
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

    let ArtistFind = await Artist.findAll({where: {isRandom: true}});

    if (!ArtistFind.length) {
      for (let i = 0; i < 50; i++) {
        const random = getRandomInt(100000, 9999999);
        const response = await axios.get(`https://api.deezer.com/artist/${random}`);
        if (response.data.name) {
          let newArtist = await Artist.create({
            apiId: response.data.id,
            name: response.data.name,
            image : response.data.picture_big === "https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg" ? "https://cdn-icons-png.flaticon.com/512/1753/1753311.png" : response.data.picture_big ,
            isRandom: true,
          });
        };
      };
      let newArtists = await Artist.findAll({where: {isRandom: true}});
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
    let topArtistFind = await Artist.findAll({where: {isTop: true}});
    if (!topArtistFind.length) {
      for (let a = 0; a < 5; a++) {
        const response = await axios.get(`https://api.deezer.com/genre/${a}/artists`)
        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data) {
            let topArtist = await Artist.create({
              apiId: response.data.data[i].id,
              name: response.data.data[i].name,
              image : response.data.data[i].picture_big,
              isTop: true,
            });
          };
        };
      };
      let topArtists = await Artist.findAll({where: {isTop: true}});
      return res.json(topArtists);
    } else {
      return res.json(topArtistFind);
    };
  } catch (error) {
    next(error);
  };
};

module.exports = { getArtist, getArtists, getArtistSongs, getArtistSongsTop, getArtistAlbums, createArtists, createTopArtists };
