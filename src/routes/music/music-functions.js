const axios = require("axios");

const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;

async function search(query, filter) {
  if (filter === "track") {
    try {
      const response = await axios.get(
        `https://api.discogs.com/database/search?${filter}=${query}&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}&page=1&per_page=10`
      );
      let results = response.data.results.map((t) => {
        return {
          title: t.title,
          thumb: t.thumb,
          id: t.id,
        };
      });
      return results;
    } catch (err) {
      throw new Error("¡No encontramos esa canción!");
    }
  } else if (filter === "artist" || filter === "master") {
    try {
      const response = await axios.get(
        `https://api.discogs.com/database/search?q=${query}&type=${filter}&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}&page=1&per_page=10`
      );
      let results = response.data.results.map((r) => {
        return {
          title: r.title,
          thumb: r.thumb,
          id: r.id,
        };
      });
      return results;
    } catch (err) {
      throw new Error("¡No encontramos lo que buscas!");
    }
  } else {
    try {
      const response = await axios.get(
        `https://api.discogs.com/database/search?q=${query}&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}&page=1&per_page=20`
      );
      let results = response.data.results.filter((t) => {
        return t.type === "artist" || t.type === "master";
      });
      results = results.map((r) => {
        return {
          title: r.title,
          thumb: r.thumb,
          id: r.id,
          type: r.type,
        };
      });
      return results;
    } catch (err) {
      throw new Error("¡No encontramos lo que buscas!");
    }
  }
}

module.exports = { search };

// if(filter === 'track'){
//   try{
//     const response = await axios.get(
//       `https://api.discogs.com/database/search?${filter}=${query}&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}&page=1&per_page=20`
//     );
//     let data = response.results.map(r => {
//       name: title
//     })
//   }
// }
