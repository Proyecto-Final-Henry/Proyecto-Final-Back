const axios = require("axios");
const { Genre } = require ("../../db.js")

async function getGenre(id) {
  try {
    const response = await axios.get(`https://api.deezer.com/genre/${id}`)
                            .then(response => {
                                return{
                                  id : response.data.id,
                                  name: response.data.name,
                                  image : response.data.picture_big
                                }
                            });
    return response;

  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};

async function getGenres() {
  try {
    const response = await axios.get(`https://api.deezer.com/genre`)
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
    // return response.data.data;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};

async function getGenreArtists(id) {
  try {
    const response = await axios.get(`https://api.deezer.com/genre/${id}/artists`)
                            .then(response => {
                                return response.data.data.map(item => {
                                    return{
                                        id : item.id,
                                        name: item.name,
                                        image : item.picture_big
                                    };
                                });
                            });
    return response;
    // return response.data.data;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  };
};

async function createGenre(req, res, next) {
  try {
    let genreCheck = await Genre.findAll();

    if(!genreCheck.length) {
      const response = await axios.get(`https://api.deezer.com/genre`);
      for (let i = 1; i < response.data.data.length; i++) { //
        await Genre.create({ 
          id : response.data.data[i].id,
          name: response.data.data[i].name,
          image : response.data.data[i].picture_big
        });
      };
      let allGenre = await Genre.findAll();
      return res.json(allGenre)
    } else {
      return res.json(genreCheck) 
    };
  } catch(error) {
    next(error);
  };
};
module.exports = { getGenre, getGenres, getGenreArtists, createGenre };
