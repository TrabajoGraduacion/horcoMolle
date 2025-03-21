const express = require('express');
const { 
  crearExamenComplementario, 
  obtenerExamenesComplementarios, 
  obtenerExamenComplementarioPorId, 
  actualizarExamenComplementario, 
  darDeBajaExamenComplementario,  // Importar la nueva función
  darDeAltaExamenComplementario,  // Importar la nueva función
  eliminarExamenComplementario 
} = require('../controllers/examenComplementario.controller');

const router = express.Router();

router.post("/", crearExamenComplementario);

router.get("/", obtenerExamenesComplementarios);

router.get("/:id", obtenerExamenComplementarioPorId);

router.put("/:id", actualizarExamenComplementario);

router.patch("/:id/dar-de-baja", darDeBajaExamenComplementario); // Ruta para dar de baja

router.patch("/:id/dar-de-alta", darDeAltaExamenComplementario); // Ruta para dar de alta

router.delete("/:id", eliminarExamenComplementario);

module.exports = router;
