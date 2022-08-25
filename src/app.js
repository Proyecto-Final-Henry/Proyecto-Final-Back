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
const userRoutes = require("./routes/user/user-routes");
const chatRoutes = require('./routes/Chat/ChatRoutes.js');
const mensajeRoutes = require('./routes/Mensajes/MensajesRoutes.js');
const { Server } = require("socket.io");
const http = require("http");
const playlistRoutes = require("./routes/playlist/playlist-routes");
const jwt = require ("jsonwebtoken");
const { User, Review } = require("./db.js");

require("./db.js");

const server = express();
const serverSocketIo = http.createServer(server)
const io = new Server(serverSocketIo , {
  cors: {
    origin: "*"
  }
})

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  console.log(onlineUsers)
  return onlineUsers.find((user) => user.username === username);
};

let activeUsers = [];

const tokenToId = async (token) => {
  try {
    const decodificarToken = jwt.verify(token , process.env.JWT_SECRET)
    const usuario = await User.findOne({where: {email: decodificarToken.email}})
    return usuario
  } catch (error) {
    console.log(error)
  };
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    // const respuesta = await tokenToId(token)
    console.log("RESPUESTA", respuesta)
    addNewUser({username:username, socketId:socket.id});
    console.log("Usuarios conectados", onlineUsers)
  });

  socket.on("sendNotification", async ({ senderName, receiverName, type, title }) => { 
    console.log(senderName, receiverName, type)
    try {
      const receiver = await getUser(receiverName);
      console.log("receiver", receiver)
      try {
        io.to(receiver.socketId).emit("getNotification", {
          senderName,
          type,
          title
        });
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    };
  });

  socket.on("sendText", ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getText", {
      senderName,
      text,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.on("connection", (socket) => {
  // agregar nuevo usuario
  socket.on("new-user-add",async (token) => {

   const respuesta = await tokenToId(token)
  //  console.log(respuesta)
  
    if(!activeUsers.some(user => user.userId === respuesta.id && respuesta.id)){
      activeUsers.push({
        userId: respuesta.id,
        socketId: socket.id
      })
    }
    io.emit("get-users", activeUsers)
    console.log("Usuarios conectados", activeUsers)
  })

  socket.on("send-message" , (data) => {
    const { receiverId } = data
    const user = activeUsers.find(user => user.userId === receiverId)

    if(user){
      io.to(user.socketId).emit("receive-message", data)
    }
  })

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
    console.log("User desconectado" , activeUsers)
    io.emit("get-users", activeUsers)
  })

});

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

server.use("/api/back-end/playlist", playlistRoutes);
server.use("/api/back-end/user", userRoutes);
server.use("/api/back-end/reviews", reviewRoutes);
server.use('/api/back-end/users', usersRoutes);
server.use('/api/back-end/songs', songsRoutes);
server.use('/api/back-end/genres', genresRoutes);
server.use('/api/back-end/artists', artistsRoutes);
server.use('/api/back-end/albums', albumsRoutes);
server.use('/api/back-end/search', searchRoutes);
server.use('/api/back-end/chat', chatRoutes);
server.use('/api/back-end/mensajes', mensajeRoutes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send({ message });
});

module.exports = {server , serverSocketIo};