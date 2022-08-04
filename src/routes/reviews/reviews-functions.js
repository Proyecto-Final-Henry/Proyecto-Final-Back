const { Review, User} = require("../../db")

const crear =  async (req, res, next) => {
    try {

        const { title, score, description, userId} = req.body
        const reviewCreated = await Review.create({
            title, score, description
        })

        const userDb = await User.findByPk(userId)
        
        const posts =  await userDb.countReviews()
        
        
        if (userDb.role === "Base" && posts >= 5) {
            res.send("Ya ha alcanzado la cantidad maxima de reviews posibles para el servicio base")
        } else {

            await userDb.addReview(reviewCreated.id)

            await reviewCreated.reload()
            
            res.send(reviewCreated)
            
        }
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

        const reviewDb = await Review.findByPk(id)

        res.send(reviewDb)

    } catch (error) {
        next(error)
    }
}

module.exports = {
    crear,
    modificar,
    getReview
};