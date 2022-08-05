const axios = require("axios");

const limit= 10;  // aqui se fija el limite de items a traer de la api

async function getsearch(query,index,filter) {
    let ruta= 'https://api.deezer.com/search'
    const responseAlbumMap= (response)=>{
        return response.data.data.map(item => {
            return {
            id : item.id,
            title: item.title,
            name:item.name,
            type: item.type,
            artist: item.artist.name,
            img: item.cover_big
            };
        });
    };
    const responseMap= (response)=>{
        return response.data.data.map(item => {
            return {
            id : item.id,
            title: item.title,
            name:item.name,
            type: item.type,
            artist: item.artist.name,
            img: item.album.cover_big
            };
        });
    };
    const responseArtistMap= (response)=>{
        return response.data.data.map(item => {
            return {
            id : item.id,
            title: item.title,
            name:item.name,
            type: item.type,
            img: item.picture_big
            }
        })
    };

    if(filter){
        if(filter==="album"){
            ruta='https://api.deezer.com/search/album'
        }else if(filter==="artist"){
            ruta='https://api.deezer.com/search/artist'
        }else if(filter==="track"){
            ruta='https://api.deezer.com/search/track'
        }
    }
    
    try {
      const response = await axios.get(`${ruta}?q=${query}&index=${index}&limit=${limit}`)
                              .then(response => {
                                let prev= undefined
                                let next= undefined
                                if(response.data.prev){
                                    prev=true
                                }
                                if(response.data.next){
                                    next=true
                                }
                                const pagination= {total: response.data.total, prev: prev, next:next, limit:limit}
                                switch (filter) {
                                    case "album":
                                        return {data:responseAlbumMap(response), ...pagination}
                                    case "artist":
                                        return  {data:responseArtistMap(response),...pagination}
                                    case "track":
                                        return {data:responseMap(response),...pagination}                                    
                                    default:
                                        return {data:responseMap(response),...pagination}
                                  }
                                
                              });
      return response;
    } catch (err) {
      throw new Error("couldn't find what you needed");
    }
  }

module.exports = {getsearch};