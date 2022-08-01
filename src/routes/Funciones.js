const axios = require ("axios")
const { User } = require ("../db")


const registrar = async (req, res) => {
    const { email } = req.body

    const existeUsuario = await User.findOne({ where : {email: email } })

    if(existeUsuario){
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = await User.create(req.body)
        res.json(usuario)
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    registrar,
}