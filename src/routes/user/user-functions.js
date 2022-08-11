const { User, Review } = require("../../db");

const follow = async (req, res, next) => {
    try {
        const{userId, followId} = req.params;
        const userDb = await User.findByPk(userId);
        const hasFollow = await userDb.hasFollowing(followId);

        if (hasFollow) {
            res.send("Ya sigues a este usuario");
        } else {
            await userDb.addFollowing(followId)
            res.send("Ahora sigues a este usuario");
        }
    } catch (error) {
        next(error)
    }
}

const unFollow = async (req, res, next) => {
    try {
        const{userId, followId} = req.params;
        const userDb = await User.findByPk(userId);
        await userDb.removeFollowing(followId);
        res.send("Has dejado de seguir a este usuario");
    } catch (error) {
        next(error);
    }
}

const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const userDb = await User.findByPk(id, {
            include: [{
                model: Review
            }, "followers", "following"]
        });
        if (userDb) {
            res.send(userDb);
        } else {
            res.send("No existe un usuario con ese Id");
        }
    } catch (error) {
        next(error);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const usersDb = await User.findAll({
            include: ["followers", "following"]
        });
        res.send(usersDb);
    } catch (error) {
        next(error);
    };
};

module.exports = {
    follow,
    getAllUsers,
    unFollow,
    getUser,
};