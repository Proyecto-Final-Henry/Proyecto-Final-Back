const express = require("express");
const router = express.Router();
const { emailNotificacions } = require("../../helpers/emailRegistro");

router.post( '/follow' , async(req, res,next)=>{ 
    const { email, nameUser, nameFollow } = req.body;
    try {
      if (nameUser && email && nameFollow) {
        emailNotificacions({ email, nameUser, nameFollow });
        res.status(200).json({ email, nameUser, nameFollow });
      } else {
        const error = new Error("Falta ingresar algún dato");
        return res.status(400).json({ msg: error.message });
      }
    } catch (error) {
      return res.status(404).json({ msg: error.message });
    }
});

module.exports = router;