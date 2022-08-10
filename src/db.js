require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
        database: DB_NAME,
        dialect: "postgres",
        host: DB_HOST,
        port: 5432,
        username: DB_USER,
        password: DB_PASSWORD,
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            // Ref.: https://github.com/brianc/node-postgres/issues/2009
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/proyecto_final`, // nombre de su db local
        { logging: false, native: false }
      );

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Album, Artist, Genre, Playlist, Review, Song, User } = sequelize.models;

Song.belongsToMany(Playlist, { through: "Playlist_Songs", timestamps: false });
// Song.belongsToMany(User, {through: "Song_Reviews", timestamps: false});
Song.belongsToMany(User, { through: "Liked_Songs", timestamps: false });
Song.belongsToMany(User, { through: "Listen_Later", timestamps: false });
Song.belongsTo(Genre);
Song.belongsTo(Artist);
Song.hasMany(Review);

// User.belongsToMany(Song, {through: "Song_Reviews", timestamps: false});
User.belongsToMany(Song, { through: "Liked_Songs", timestamps: false });
User.belongsToMany(Song, { through: "Listen_Later", timestamps: false });
User.hasMany(Review); // written reviews

User.belongsToMany(User, { as: "followers" ,through: "User_Followers", foreignKey: "follower_id", otherKey: "following_id",timestamps: false })
User.belongsToMany(User, { as: "following" ,through: "User_Followers", foreignKey: "following_id", otherKey: "follower_id" ,timestamps: false })

Album.belongsTo(Artist);
Album.belongsToMany(Genre, { through: "Album_Genre", timestamps: false });;
Album.hasMany(Song);
Album.hasMany(Review);

Artist.hasMany(Review);
Artist.hasMany(Album);
Artist.hasMany(Review);

Review.belongsTo(User);
Review.belongsTo(Song);
Review.belongsTo(Album);
Review.belongsTo(Artist);

Playlist.hasMany(Song);
Playlist.belongsTo(User);

Genre.hasMany(Song);
Genre.belongsToMany(Artist, { through: "Genre_Artists", timestamps: false });
Genre.belongsToMany(Album, { through: "Album_Genre", timestamps: false });;

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
