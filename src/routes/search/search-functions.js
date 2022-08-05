const axios = require("axios");

async function getsearch(query,index,filter) {
    let ruta= 'https://api.deezer.com/search'
    const responseMap= (response)=>{
        return response.data.data.map(item => {
            return {
            id : item.id,
            title: item.title,
            name:item.name,
            type: item.type,
            artist: item.artist.name
            }
        })
    };
    const responseArtisMap= (response)=>{
        return response.data.data.map(item => {
            return {
            id : item.id,
            title: item.title,
            name:item.name,
            type: item.type,
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
      const response = await axios.get(`${ruta}?q=${query}&index=${index}`)
                              .then(response => {
                                switch (filter) {
                                    case "album":
                                        return responseMap(response)                                                                         
                                    case "artist":
                                        return responseArtisMap(response)
                                    case "track":
                                        return responseMap(response)                                    
                                    default:
                                        return responseMap(response)
                                  }
                                
                              });
      return response;
    } catch (err) {
      throw new Error("couldn't find what you needed");
    }
  }

module.exports = {getsearch};