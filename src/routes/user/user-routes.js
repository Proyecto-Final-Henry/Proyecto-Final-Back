const { Router } = require("express");
const router = Router();
const { follow, getAllUsers, unFollow, getUser } = require("./user-functions")

router.get("/", getAllUsers) //AVISO: Esta ruta, junto con su funcion, son solo de prueba parar corroborar las rutas de follow y unFollow

router.get("/:id", getUser)

router.get("/follow/:userId/:followId", follow)

router.get("/unFollow/:userId/:followId", unFollow)

module.exports = router;