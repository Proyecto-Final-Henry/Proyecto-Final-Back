const jwt = require ("jsonwebtoken");
const { User, Review } = require("../db.js");

const checkAutenticacion = async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1]
            const decodificarToken = jwt.verify(token, process.env.JWT_SECRET)
            req.usuario = await User.findOne({where:{email: decodificarToken.email} ,include: [{
                model: Review
            }, "followers", "following"]});
            return next();
        } catch (error) {
            const e = new Error("Token invalido")
            return res.status(403).json({msg: e.message})
        };
    };
    if(!token){
        const error = new Error ("Token no valido o inexistente")
        res.status(403).json({msg: error.message})
    };
    next();
};

module.exports = { checkAutenticacion };