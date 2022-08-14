const axios = require("axios");
const { Review, Artist, Album, Song } = require("../../db");

const limitFixed=10; // aqui se fija el limite de items a traer de la api
let limit = limitFixed; 

function filterSearch(response, filters){
  let far,fal,fex,explicit;
  let isFilter=false;
  let result={};
  filters.artist && filters.artist!== 'Seleccione un artista'? far=true : far=false;
  filters.album && filters.album!== 'Seleccione un album'? fal=true : fal=false;
  filters.explicit && filters.explicit!== 'Seleccione una opción'? fex=true : fex=false;  
  filters.explicit==="true"? explicit= true: explicit= false;
  responseFilter=response.data
  let cAr = far && !fal && !fex;
  let cAl = !far && fal && !fex;
  let cEx = !far && !fal && fex;
  let cArAl = far && fal && !fex;
  let cArAlEx = far && fal && fex;
  let cArEx = far && !fal && fex;
  let cAlEx = !far && fal && fex;

  switch (true) {
    case cAr:
      responseFilter=responseFilter.filter(e=>e.artist===filters.artist);
      isFilter=true
      break
    case cAl:
      responseFilter=responseFilter.filter(e=>e.album===filters.album)
      isFilter=true
      break
    case cEx:   
      responseFilter=responseFilter.filter(e=>e.explicit===explicit)
      isFilter=true
      break
    case cArAl:
      responseFilter=responseFilter.filter(e=>e.artist===filters.artist && e.album===filters.album)
      isFilter=true
      break
    case cArAlEx:
      responseFilter=responseFilter.filter(e=>e.artist===filters.artist && e.album===filters.album && e.explicit===explicit)
      isFilter=true
      break
    case cArEx:
      responseFilter=responseFilter.filter(e=>e.artist===filters.artist && e.explicit===explicit)
      isFilter=true
      break
    case cAlEx:
      responseFilter=responseFilter.filter(e=>e.album===filters.album && e.explicit===explicit)
      isFilter=true
      break
    default:
  }
  if(isFilter){
    result = {
      data:responseFilter ,
      total:responseFilter.length + " de " + response.total,
      array: response.data.length,
      prev:undefined,
      next:undefined,
      limit: response.limit
    }
  }else{
    result = {
      data:responseFilter,
      total:response.total,
      prev:response.prev,
      next:response.next,
      limit: response.limit
    }
  }
  
  return result
}

async function getArtistSongs(query,limit) {
  try {
    const response = await axios.get(`https://api.deezer.com/search/track?q=${query}&limit=${limit}`)
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
                                  artist:{idArtist:item.artist.id, artistName:item.artist.name},
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

async function getsearch(query, index, filter,filters) {
  let ruta = "https://api.deezer.com/search";
  const responseAlbumMap = (response) => {
    return response.data.data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        name: item.name,
        type: item.type,
        artist: item.artist.name,
        artistId: item.artist.id,
        img: item.cover_big,
        explicit: item.explicit_lyrics
      };
    });
  };
  const responseMap = (response) => {
    return response.data.data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        name: item.name,
        type: item.type,
        artist: item.artist.name,
        artistId: item.artist.id,
        img: item.album.cover_big,
        album: item.album.title,
        albumId: item.album.id,
        explicit: item.explicit_lyrics
      };
    });
  };
  const responseArtistMap = (response) => {
    return response.data.data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        name: item.name,
        type: item.type,
        img: item.picture_big,
      };
    });
  };

  if (filter) {
    if (filter === "album") {
      ruta = "https://api.deezer.com/search/album";
    } else if (filter === "artist") {
      ruta = "https://api.deezer.com/search/artist";
    } else if (filter === "track") {
      ruta = "https://api.deezer.com/search/track";
    }
  }
  if((filters.artist && filters.artist!== 'Seleccione un artista') || (filters.album && filters.album!== 'Seleccione un album') || (filters.explicit && filters.explicit!== 'Seleccione una opción')){
    limit=300
  }else{
    limit=limitFixed
  }

  try {
    const response = await axios
      .get(`${ruta}?q=${query}&index=${index}&limit=${limit}`)
      .then((response) => {
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
        switch (filter) {
          case "album":
            return { data: responseAlbumMap(response), ...pagination };
          case "artist":
            return { data: responseArtistMap(response), ...pagination };
          case "track":
            return { data: responseMap(response), ...pagination };
          default:
            return { data: responseMap(response), ...pagination };
        }
      });
    return response;
  } catch (err) {
    res.json("No se encontro lo que buscabas :(");
  }
}

const getSearchDb = async (id, type, next) => {
  try {
    switch (type) {
      case "artist":
        const artistDb = await Artist.findOne({
          where: { apiId: id },
          include: [
            {
              model: Review,
            },
          ],
        });

        if (artistDb) {
          return artistDb;
        } else {
          return "No se encontro un artista con ese id en la base de datos";
        }
      case "song":
        const songDb = await Song.findOne({
          where: { apiId: id },
          include: [
            {
              model: Review,
            },
          ],
        });

        if (songDb) {
          return songDb;
        } else {
          return "No se encontro una canción con ese id en la base de datos";
        }
      case "album":
        const albumDb = await Album.findOne({
          where: { apiId: id },
          include: [
            {
              model: Review,
            },
          ],
        });

        if (albumDb) {
          return albumDb;
        } else {
          return "No se encontro un album con ese id en la base de datos";
        }
      default:
        return "Informacion insuficiente para realizar la busqueda";
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getsearch, getSearchDb,getArtistSongs,filterSearch, limit };
