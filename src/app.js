const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require("cors");
const reviewRoutes = require('./routes/reviews/reviews-routes.js');
const usersRoutes  = require('./routes/users/usersRoutes.js');
const songsRoutes  = require("./routes/music/music-routes");
const genresRoutes  = require("./routes/genres/genres-routes");
const artistsRoutes  = require("./routes/artists/artists-routes");
const albumsRoutes  = require("./routes/albums/albums-routes");
const searchRoutes  = require('./routes/search/search-routes');
const userRoutes = require("./routes/user/user-routes")

require("./db.js");

const server = express();

server.name = "API";

server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use("/api/back-end/user", userRoutes)
server.use("/api/back-end/reviews", reviewRoutes);
server.use('/api/back-end/users', usersRoutes);
server.use('/api/back-end/songs', songsRoutes);
server.use('/api/back-end/genres', genresRoutes);
server.use('/api/back-end/artists', artistsRoutes);
server.use('/api/back-end/albums', albumsRoutes);
server.use('/api/back-end/search', searchRoutes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send({ message });
});

module.exports = server;
