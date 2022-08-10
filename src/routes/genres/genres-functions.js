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

async function createGenre() {
  try {
    const response = await axios.get(`https://api.deezer.com/genre`);

    for (let i = 0; i <= response.data.data.length; i++) {
      await Genre.bulkCreate({ 
        id : response.data.data.id,
        name: response.data.data.name,
        image : response.data.data.picture_big
      });
    };

    let allGenre = await Genre.findAll();

    return allGenre;
  } catch(error) {
    return error;
  };
};
module.exports = { getGenre, getGenres, getGenreArtists, createGenre };
