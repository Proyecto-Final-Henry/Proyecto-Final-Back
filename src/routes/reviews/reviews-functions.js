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
    }

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
    }

    await reviewCreated.reload();

    res.send(reviewCreated);
  } catch (error) {
    next(error);
  }
};

const modificar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title, score, description } = req.body;

    const reviewDb = await Review.findByPk(id);

    if (title) {
      reviewDb.title = title;
    }

    if (score) {
      reviewDb.score = score;
    }

    if (description) {
      reviewDb.description = description;
    }

    await reviewDb.save();

    res.send(reviewDb);
  } catch (error) {
    next(error);
  }
};

const getReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const reviewDb = await Review.findByPk(id);

      res.send(reviewDb);
    } else {
      const allReviewArtists = await Review.findAll({
        where: {
          show: true,
          songId: null,
          albumId: null,
        },
        include: [
          {
            model: User,
            include: ["followers", "following", "likes"],
          },
          {
            model: Artist,
          }, "likes"
        ],
      });

      const allReviewAlbums = await Review.findAll({
        where: {
          show: true,
          songId: null,
          artistId: null,
        },
        include: [
          {
            model: User,
            include: ["followers", "following", "likes"],
          },
          {
            model: Album,
          }, "likes"
        ],
      });
      
      const allReviewSongs = await Review.findAll({
        where: {
          show: true,
          artistId: null,
          albumId: null,
        },
        include: [
          {
            model: User,
            include: ["followers", "following", "likes"],
          },
          {
            model: Song,
          }, "likes"
        ],
      });

      const allReviews = allReviewArtists.concat(
        allReviewAlbums,
        allReviewSongs
      );

      res.send(allReviews);
    }
  } catch (error) {
    next(error);
  }
};

const getUserReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userReviews = await Review.findAll({
      where: {
        userId: id,
        show: true,
      },
    });

    if (userReviews.length > 0) {
      res.send(userReviews);
    } else {
      res.send("El usuario no tiene reviews publicadas");
    }
  } catch (error) {
    next(error);
  }
};

const getResourceReviews = async (req, res, next) => {
  try {
    const { id, type } = req.query;

    switch (type) {
      case "artist":
        let artistReviews = await Artist.findOne({
          where: { apiId: id },
          include: [
            {
              model: Review,
              where: { show: true },
              include: [{ model: User }],
            },
          ],
        });
        if (artistReviews) {
          artistReviews = {
            artistId: artistReviews.id,
            name: artistReviews.name,
            apiId: artistReviews.apiId,
            reviews: artistReviews.reviews.map((r) => {
              return {
                reviewId: r.id,
                title: r.title,
                score: r.score,
                description: r.description,
                userId: r.userId,
                userImg: r.user.userImg,
                user: r.user.name,
                userRole: r.user.role,
              };
            }),
          };
        } else {
          return res.send("no hay reseñas");
        }
        return res.json(artistReviews);
      case "album":
        let albumReviews = await Album.findOne({
          where: { apiId: id },
          include: [
            {
              model: Review,
              where: { show: true },
              include: [{ model: User }],
            },
          ],
        });
        if (albumReviews) {
          albumReviews = {
            albumId: albumReviews.id,
            name: albumReviews.name,
            apiId: albumReviews.id,
            reviews: albumReviews.reviews.map((r) => {
              return {
                reviewId: r.id,
                title: r.title,
                score: r.score,
                description: r.description,
                userId: r.userId,
                userImg: r.user.userImg,
                user: r.user.name,
                userRole: r.user.role,
              };
            }),
          };
        } else {
          return res.send("no hay reseñas");
        }
        return res.json(albumReviews);
      case "song":
        let songReviews = await Song.findOne({
          where: { apiId: id },
          include: [
            {
              model: Review,
              where: { show: true },
              include: [{ model: User }],
            },
          ],
        });
        if (songReviews) {
          songReviews = {
            songId: songReviews.id,
            name: songReviews.name,
            apiId: songReviews.id,
            reviews: songReviews.reviews.map((r) => {
              return {
                reviewId: r.id,
                title: r.title,
                score: r.score,
                description: r.description,
                userId: r.userId,
                userImg: r.user.userImg,
                user: r.user.name,
                userRole: r.user.role,
              };
            }),
          };
          return res.json(songReviews);
        } else {
          return res.send("no hay reseñas");
        }
      default:
        res.json({ error: "Información insuficiente" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviewDb = await Review.findByPk(id);
    reviewDb.show = false;
    await reviewDb.save();
    res.send("Se ha eliminado la review correctamente");
  } catch (error) {
    next(error);
  }
};


const likeReview = async (req, res, next) => {
  try {
      const{userId, reviewId} = req.params;
      const userDb = await User.findByPk(userId);
      const hasLike = await userDb.hasLikes(reviewId);

      if (hasLike) {
          await userDb.removeLikes(reviewId)
          res.send("Diste dislike a esta review");
      } else {
          await userDb.addLikes(reviewId);
          res.send("Diste like a esta review");
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
  getResourceReviews,
  deleteReview,
  likeReview
};
