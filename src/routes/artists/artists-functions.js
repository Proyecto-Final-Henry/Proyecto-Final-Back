const axios = require("axios");

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

async function getArtistSongs(id) {
  try {
    const response = await axios.get(`https://api.deezer.com/artist/${id}/top?limit=50`)
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

module.exports = { getArtist,getArtists,getArtistSongs,getArtistSongsTop };
