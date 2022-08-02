const axios = require("axios");

const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;

async function searchAny(query) {
  try {
    const response = await axios.get(
      `https://api.discogs.com/database/search?q=${query}&key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`
    );
    return response;
  } catch (err) {
    throw new Error("couldn't find what you needed");
  }
}

module.exports = searchAny;
