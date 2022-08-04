const { Review, User, Song, Artist, Album} = require("../../db")

const crear =  async (req, res, next) => {
    try {

        const { title, score, description, userId, songId, albumId, artistId} = req.body

        const reviewCreated = await Review.create({
            title, score, description
        })

        const userDb = await User.findByPk(userId)
        
        const posts =  await userDb.countReviews()
        
        
        
        if (userDb.role === "Base" && posts >= 5) {
            return res.send("Ya ha alcanzado la cantidad maxima de reviews posibles para el servicio base")
        }

            await userDb.addReview(reviewCreated.id)


            if (songId) {
                reviewCreated.addSong(songId)
            } else if (albumId) {
                reviewCreated.addAlbum(albumId)
            } else if (artistId) {
                reviewCreated.addArtist(artistId)
            }

            await reviewCreated.reload()
            
            res.send(reviewCreated)
            
    } catch (error) {
        next(error)
    }
};

const modificar = async (req, res, next) => {
    try {

        const {id} = req.params

        const { title, score, description} = req.body
        
        const reviewDb = await Review.findByPk(id)

        if (title) {
            reviewDb.title = title
        }

        if (score) {
            reviewDb.score = score
        }

        if (description) {
            reviewDb.description = description
        }

        await reviewDb.save()

        res.send(reviewDb)

    } catch (error) {
        next(error)
    }
}

const getReview = async (req, res, next) => {
    try {

        const {id} = req.params

        if (id) {

            const reviewDb = await Review.findByPk(id)
    
            res.send(reviewDb)
            
        } else {

            const allReview = await Review.findAll()

            res.send(allReview)
            
        }

    } catch (error) {
        next(error)
    }
}

const getUserReview = async (req, res, next) => {
    try {

        const {id} = req.params

        const userReviews = await Review.findAll({
            where: {
                userId: id
            }
        })

        if (userReviews.length > 0) {

            res.send(userReviews)

        } else {
            res.send("El usuario no tiene reviews publicadas")

        }

    } catch (error) {
        next(error)
    }
}

module.exports = {
    crear,
    modificar,
    getReview,
    getUserReview
};