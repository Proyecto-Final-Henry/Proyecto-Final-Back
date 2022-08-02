const axios = require ("axios")
const { User } = require ("../db")
const bcrypt = require ("bcrypt")

const registrar = async (req, res) => {
    const { email } = req.body;

    const existeUsuario = await User.findOne({ where : {email: email } });

    if(existeUsuario){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message});
    };

    try {
        const usuario = await User.create(req.body)
        usuario.password = await bcrypt.hash(usuario.password , 10)
        await usuario.save()
        res.json(usuario)
        const usuario = await User.create(req.body);
        res.json(usuario);
    } catch (error) {
        console.log(error);
    };
};


const confirmar = async (req ,res) => {
    const { token } = req.params

    const usuarioConfirmar = await User.findOne({ where: {token : token}})

    if(!usuarioConfirmar){
        const error = new Error ("Token no valido")
        return res.status(404).json({msg: error.message})
    }

    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()
        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req,res) => {
    const { email , password } = req.body

    const usuario = await User.findOne({ where : { email : email}})

    if(!usuario){
        const error = new Error ("Usuario inexistente")
        return res.status(404).json({msg: error.message})
    }

    if(!usuario.confirmado){
        const error = new Error ("Tu cuenta aun no a sido confirmada")
        return res.status(403).json({msg: error.message})
    }

    if(await bcrypt.compare(password, usuario.password)){
        res.json(usuario)
    } else {
        const error = new Error("El password es incorrecto")
        return res.status(404).json({msg : error.message}) 
    }
}



module.exports = {
    registrar,
    confirmar,
    autenticar,
}