const { Review, User, Song, Artist, Album } = require("../../db");
const registerAlbum = require("../db-register/register-album");
const registerArtist = require("../db-register/register-artist");
const registerSong = require("../db-register/register-song");

const crear = async (req, res, next) => {
  try {
    const { title, score, description, userId, type, apiId, name } = req.body;
    
    
    const userDb = await User.findByPk(userId);
    const posts = await userDb.countReviews();
    
        if (userDb.role === "Base" && posts >= 5) {
          return res.send(
            "Ya ha alcanzado la cantidad maxima de reviews posibles para el servicio base"
          );
        };


    const reviewCreated = await Review.create({
      title,
      score,
      description,
    });

    

    await userDb.addReview(reviewCreated.id);

    switch (type) {
      case "song":
        const { song } = await registerSong(name, apiId);
        await song.addReview(reviewCreated.id);
        break;
      case "album":
        const { album } = await registerAlbum(name, apiId);
        await album.addReview(reviewCreated.id);
        break;
      case "artist":
        const { artist } = await registerArtist(name, apiId);
        await artist.addReview(reviewCreated.id);
        break;
    };

    await reviewCreated.reload();

    res.send(reviewCreated);
  } catch (error) {
    next(error);
  };
};

const modificar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, score, description } = req.body;

    const reviewDb = await Review.findByPk(id);

    if (title) {
      reviewDb.title = title;
    };

    if (score) {
      reviewDb.score = score;
    };

    if (description) {
      reviewDb.description = description;
    };

    await reviewDb.save();

    res.send(reviewDb);
  } catch (error) {
    next(error);
  };
};

const getReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const reviewDb = await Review.findByPk(id);

      res.send(reviewDb);
    } else {
      const allReview = await Review.findAll({
        include: {
          model: User
        }
      });

      res.send(allReview);
    };
  } catch (error) {
    next(error);
  };
};

const getUserReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userReviews = await Review.findAll({
      where: {
        userId: id,
      },
    });

    if (userReviews.length > 0) {
      res.send(userReviews);
    } else {
      res.send("El usuario no tiene reviews publicadas");
    };
  } catch (error) {
    next(error);
  };
};

module.exports = {
  crear,
  modificar,
  getReview,
  getUserReview,
};
