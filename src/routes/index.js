const { Router } = require('express');
const { Op } = require ("sequelize")
const { Users } = require ("../db")
const { Songs } = require ("../db")
const axios = require("axios");
const { API_KEY } = process.env;
const { registrar, login, logout } = require("./Funciones.js")

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
router.post("/login", login, isNotAuthenticated);
router.post("/logout", logout);
// router.post("/home", isAuthenticated);


module.exports = router;