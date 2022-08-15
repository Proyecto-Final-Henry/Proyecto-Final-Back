const { User, Review } = require("../../db");

const follow = async (req, res, next) => {
    try {
        const{userId, followId} = req.params;
        const userDb = await User.findByPk(userId);
        const hasFollow = await userDb.hasFollowing(followId);

        if (hasFollow) {
            res.send("Ya sigues a este usuario");
        } else {
<<<<<<< HEAD
            await userDb.addFollowing(followId);
            res.send("Ahora sigues a este usuario");
        };
=======
            await userDb.addFollowing(followId)
            res.send("Ahora sigues a este usuario");
        }
>>>>>>> 6a4d879dd39e6c8b703500b8dc029057b7ef0799
    } catch (error) {
        next(error);
    };
};

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
<<<<<<< HEAD

=======
>>>>>>> 6a4d879dd39e6c8b703500b8dc029057b7ef0799
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
<<<<<<< HEAD
        };
    } catch (error) {
        next(error);
    };
};
=======
        }
    } catch (error) {
        next(error);
    }
}
>>>>>>> 6a4d879dd39e6c8b703500b8dc029057b7ef0799

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
<<<<<<< HEAD

=======
>>>>>>> 6a4d879dd39e6c8b703500b8dc029057b7ef0799

module.exports = {
    follow,
    getAllUsers,
    unFollow,
    getUser,
};