const axios = require("axios");


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
  }
}

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
  }
}
async function getGenreArtists(id) {
  try {
    const response = await axios.get(`https://api.deezer.com/genre/${id}/artists`)
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
  }
}

module.exports = { getGenre,getGenres,getGenreArtists };
