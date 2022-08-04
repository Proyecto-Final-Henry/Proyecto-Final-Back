const { Router } = require("express");
const { User } = require("../db")

const router = Router();

router.get("/:id", async (req, res, next) => {
    try {
        
        const {id} = req.params

        const userDb = await User.findByPk(id)

        res.send(userDb)

    } catch (error) {
        next(error)
    }
})

module.exports = router;