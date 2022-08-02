const { Router } = require('express');
const { Op } = require ("sequelize")
const { Users } = require ("../db")
const { Songs } = require ("../db")
const axios = require("axios");
const { API_KEY } = process.env;
const { registrar , confirmar , autenticar} = require("./Funciones.js")

const router = Router();

const isAuthenticated = (req, res, next) => {
    if (!req.cookies.userId) {
      return res.redirect("/login")
    };
    next();
  };
  
  const isNotAuthenticated = (req, res, next) => {
    if (req.cookies.userId) {
      return res.redirect("/home")
    };
    next();
  };

router.post("/register", registrar, isNotAuthenticated);

// router.post("/feed", isAuthenticated);

router.get("/confirmar/:token" , confirmar)

router.post("/login" , autenticar)


module.exports = router;