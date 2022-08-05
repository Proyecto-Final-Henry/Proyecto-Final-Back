const axios = require("axios");

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


module.exports = { getAlbum, getAlbumSongs };
