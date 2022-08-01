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

const login = async (req, res, next) => {
    const { email, contraseña } = req.body

    const existeUsuario = await User.findOne({ where : {email: email } })

    if(!existeUsuario){
        const error = new Error("No existe un usuario con ese Email")
        return res.status(404).json({msg: error.message})
    }

    if(existeUsuario.contraseña !== contraseña) {
        const error = new Error("Contraseña invalida")
        return res.status(400).json({msg: error.message})
    }

    try {
        res.cookie("usuarioId", existeUsuario.id);
        res.json("Login exitoso")
        // res.redirect("/feed");
    } catch (error) {
        next(error)
    }
}

module.exports = {
    registrar,
    login,
}