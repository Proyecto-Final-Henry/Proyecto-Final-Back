const axios = require("axios");
const { User, Review } = require("../../db.js");
const bcrypt = require("bcrypt");
const { emailRegistro } = require("../../helpers/emailRegistro");
const { emailOlvidePassword } = require("../../helpers/emailOlvidePassword.js");
const { generarJWT } = require("../../helpers/generarJWT");
const { generarId } = require("../../helpers/generarId.js");
const mercadopago = require("mercadopago");
const { cloudinary } = require("../../helpers/cloudinary");
const { emailNoti } = require("../../helpers/emailNotificacion.js");
const { FRONTEND_URL, BACKEND_URL } = process.env;

const registrar = async (req, res) => {
  const { email, name } = req.body;
  const existeUsuario = await User.findOne({ where: { email: email } });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    const usuario = await User.create(req.body);
    usuario.password = await bcrypt.hash(usuario.password, 10);
    await usuario.save();
    //Enviar Email
    emailRegistro({ email, name, token: usuario.token });
    res.json(usuario);
  } catch (error) {
    console.log(error);
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  console.log(token);
  const usuarioConfirmar = await User.findOne({ where: { token: token } });

  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await User.findOne({ where: { email: email } });

  if (!usuario) {
    const error = new Error("Usuario inexistente");
    return res.status(404).json({ msg: error.message });
  }

  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta aun no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  let now = new Date();
  if (!usuario.active && now >= new Date(usuario.eliminatedAt)) {
    const error = new Error("Usuario eliminado");
    return res.status(410).json({ msg: error.message });
  }

  if (await bcrypt.compare(password, usuario.password)) {
    usuario.token = generarJWT(usuario.email);
    await usuario.save();
    res.json(usuario);
  } else {
    const error = new Error("La contraseña es incorrecta");
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const usuario = req.usuario;
  try {
     await res.json({
      id: usuario.id,
      name: usuario.name,
      userImg: usuario.userImg,
      email: usuario.email,
      role: usuario.role,
      createdDate: usuario.createdDate,
      userImg: usuario.userImg,
      reviews: usuario.reviews,
      followers: usuario.followers,
      following: usuario.following,
      active: usuario.active,
    });
  } catch (error) {
    console.log(error);
  };
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuarioExiste = await User.findOne({ where: { email: email } });

  if (!usuarioExiste) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  };

  try {
    usuarioExiste.token = generarId();
    await usuarioExiste.save();
    //Envio de Email
    emailOlvidePassword({
      email,
      name: usuarioExiste.name,
      token: usuarioExiste.token,
    });
    res.json({ msg: "Hemos enviado el mail con las instrucciones" });
  } catch (error) {
    console.log(error);
  };
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await User.findOne({ where: { token: token } });

  if (tokenValido) {
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  };
};

const nuevaPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await User.findOne({ where: { token: token } });
  console.log(usuario);
  if (!usuario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  };
  try {
    usuario.token = null;
    usuario.password = await bcrypt.hash(password, 10);
    await usuario.save();
    res.json({ msg: "Contraseña modificada correctamente" });
  } catch (error) {
    console.log(error);
  };
};

mercadopago.configure({
  // access_token: "APP_USR-2455911465194012-080513-14612c15e2e877be43dd299f129d5eb3-202026161"
  // access_token alt: "APP_USR-3599770472888555-081520-36e9e106b0bc297effcc9d08fc27403e-202026161"
  // test access_token: TEST-2455911465194012-080513-b152529ae5ceb1b3dada2600b566f507-202026161
  access_token:
    "TEST-2455911465194012-080513-b152529ae5ceb1b3dada2600b566f507-202026161",
  // NUMERO DE TARJETA : 4509 9535 6623 3704
  // CODIGO DE SEGURIDAD : 123
  // VENCIMIENTO : 11/25
});

const crearPagoMELI = async (req, res) => {
  const { usuario } = req;
  const id = usuario.id;
  let preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      },
    ],
    back_urls: {
      success: `https://remusic.onrender.com/api/back-end/users/feedback/${id}`, // https://remusic.onrender.com / http://localhost:3001
      failure: `https://remusic.onrender.com/api/back-end/users/feedback/${id}`,
      pending: `https://remusic.onrender.com/api/back-end/users/feedback/${id}`,
    },
    auto_return: "approved",
    payment_methods: {
      excluded_payment_types: [
        {
          id: "ticket",
        },
      ],
    },
  };
  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body });
  } catch (error) {
    console.log(error);
  };
};

const baseApremium = async (req, res) => {
  const { id } = req.params;
  const usuario = await User.findOne({ where: { id: id } });
  console.log(usuario.name);
  console.log(req.query.status);
  if (req.query.status === "approved") {
    try {
      usuario.role = "Premium";
      await usuario.save();
      res.redirect(`https://proyecto-final-front-tau.vercel.app/pay/success`); // https://proyecto-final-front-tau.vercel.app / http://localhost:3001
    } catch (error) {
      console.log(error);
      res.redirect(`https://proyecto-final-front-tau.vercel.app/pay/error`); // https://proyecto-final-front-tau.vercel.app
    }
  } else {
    res.redirect(`https://proyecto-final-front-tau.vercel.app/feed`); // https://proyecto-final-front-tau.vercel.app
  };
};

const googleLogin = async (req, res) => {
  const { email } = req.body;

  const usuario = await User.findOne(
    { where: { email: email } },
    {
      include: [
        {
          model: Review,
        },
        "followers",
        "following",
      ],
    }
  );

  if (usuario) {
    let now = new Date();
    if (!usuario.active && now >= new Date(usuario.eliminatedAt)) {
      const error = new Error("Usuario eliminado");
      return res.status(410).json({ msg: error.message });
    } else {
      return res.json(usuario);
    };
  };
  try {
    const nuevoUsuario = await User.create(req.body);
    nuevoUsuario.token = generarJWT(nuevoUsuario.email);
    nuevoUsuario.password = generarId();
    nuevoUsuario.confirmado = true;
    await nuevoUsuario.save();
    console.log(nuevoUsuario);
    res.json(nuevoUsuario);
  } catch (error) {
    const e = new Error("Ups algo salio mal");
    return res.status(400).json({ msg: e.message });
  }
};

const sendEmailContact = async (req, res) => {
  const { email, name, message } = req.body;
  try {
    if (name && email && message) {
      emailContact({ email, name, message });
      res.status(200).json({ email, name, message });
    } else {
      const error = new Error("Falta ingresar algún dato");
      return res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const setProfilePicture = async (req, res, next) => {
  const base64Img = req.body.data;
  const { userId } = req.body;
  try {
    const uploadConfirm = await cloudinary.uploader.upload(base64Img, {
      folder: "profile_pics",
      transformation: {
        aspect_ratio: "1:1",
        crop: "crop",
      },
    });
    let user = await User.findByPk(userId);
    user.set({
      userImg: uploadConfirm.secure_url,
    });
    await user.save();
    res.send(user);
  } catch (error) {
    next(error);
  }
};

const deactivateAccount = async (req, res, next) => {
  const { userId } = req.body;
  const { role } = req.query;
  try {
    const user = await User.findByPk(userId);
    if (!user.active) {
      return res.status(409).json({
        Conflict: `el perfil ya fue desactivado. Eliminación: ${user.eliminatedAt}`,
      });
    } else {
      let eliminated = new Date();
      if (!role || role !== "admin") {
        eliminated = new Date(eliminated.setMonth(eliminated.getMonth() + 1));
      }
      user.set({
        active: false,
        eliminatedAt: eliminated,
      });
      await user.save();
      res
        .status(200)
        .json({ OK: `eliminación de perfil: ${user.eliminatedAt}` });
    }
  } catch (error) {
    next(error);
  }
};

const restoreAccount = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const now = new Date();
    const user = await User.findByPk(userId);
    if (!user.active && now > new Date(user.eliminatedAt)) {
      return res.status(410).json({ Gone: "el perfil fue eliminado" });
    } else {
      user.set({
        active: true,
        eliminatedAt: null,
      });
      await user.save();
      return res.status(202).json({ Accepted: "el perfil fue restaurado" });
    }
  } catch (error) {
    next(error);
  }
};

const givePremium = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (user.role === "Premium") {
      return res.status(409).json({
        Conflict: `El usuario ya es premium`,
      });
    } else {
      user.set({
        role: "Premium",
      });
      await user.save();
      res.status(200).json({ OK: `Usuario ${user.name} ahora es premium` });
    }
  } catch (error) {
    next(error);
  }
};

const takePremium = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (user.role !== "Premium") {
      return res.status(409).json({
        Conflict: `Este usuario no es premium`,
      });
    } else {
      user.set({
        role: "Gratuito",
      });
      await user.save();
      res.status(200).json({ OK: `Usuario ${user.name} ya no es premium` });
    }
  } catch (error) {
    next(error);
  }
};

const giveAdmin = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (user.role === "Admin") {
      return res.status(409).json({
        Conflict: `El usuario ya es Admin`,
      });
    } else {
      user.set({
        role: "Admin",
      });
      await user.save();
      res.status(200).json({ OK: `Usuario ${user.name} ahora es Admin` });
    }
  } catch (error) {
    next(error);
  }
};

const takeAdmin = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (user.role !== "Admin") {
      return res.status(409).json({
        Conflict: `Este usuario no es Admin`,
      });
    } else {
      user.set({
        role: "Gratuito",
      });
      await user.save();
      res.status(200).json({ OK: `Usuario ${user.name} ya no es Admin` });
    }
  } catch (error) {
    next(error);
  }
};

const pruebaEmail = async (req,res) => {
  console.log(req.body)
  const { email , name } = req.body
  try {
    emailNoti({email,name})
    res.json({msg: "Enviado correctamente"})
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  registrar,
  confirmar,
  autenticar,
  perfil,
  sendEmailContact,
  olvidePassword,
  comprobarToken,
  nuevaPassword,
  crearPagoMELI,
  baseApremium,
  googleLogin,
  setProfilePicture,
  deactivateAccount,
  restoreAccount,
  givePremium,
  takePremium,
  giveAdmin,
  takeAdmin,
  pruebaEmail,
};
