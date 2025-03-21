const express = require("express");
const {
  crearNecropsia,
  obtenerNecropsias,
  obtenerNecropsiaPorId,
  actualizarNecropsia,
  eliminarNecropsia,
  darDeBajaNecropsia,    // Importar la nueva función
  darDeAltaNecropsia     // Importar la nueva función
} = require("../controllers/necropsia.controller");

const router = express.Router();

router.post("/", crearNecropsia);

router.get("/", obtenerNecropsias);

router.get("/:id", obtenerNecropsiaPorId);

router.put("/:id", actualizarNecropsia);

router.patch("/:id/dar-de-baja", darDeBajaNecropsia);  // Ruta para dar de baja

router.patch("/:id/dar-de-alta", darDeAltaNecropsia);  // Ruta para dar de alta

router.delete("/:id", eliminarNecropsia);

module.exports = router;
