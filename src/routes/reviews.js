const { Router } = require("express");
const { Review, User } = require("../db")

const router = Router();

router.post("/create", async (req, res, next) => {
    try {

        const { title, score, description, userId} = req.body
        const reviewCreated = await Review.create({
            title, score, description
        })

        const userDb = await User.findByPk(userId)
        
        const posts =  await userDb.countReviews()
        
        console.log(posts)
        
        if (userDb.role === "Base" && posts >= 5) {
            console.log("se corto")
            res.send("Ya ha alcanzado la cantidad maxima de reviews posibles para el servicio base")
        } else {

            await userDb.addReview(reviewCreated.id)
            
            res.send()
            
        }
    } catch (error) {
        next(error)
    }
});

module.exports = router;