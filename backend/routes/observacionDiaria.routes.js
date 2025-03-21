const express = require("express");
const {
  crearObservacionDiaria,
  obtenerObservacionesDiarias,
  obtenerObservacionDiariaPorId,
  actualizarObservacionDiaria,
  eliminarObservacionDiaria,
  darDeBajaObservacionDiaria,  // Importar la nueva función
  darDeAltaObservacionDiaria   // Importar la nueva función
} = require("../controllers/observacionDiaria.controller");

const router = express.Router();

router.post("/", crearObservacionDiaria);

router.get("/", obtenerObservacionesDiarias);

router.get("/:id", obtenerObservacionDiariaPorId);

router.put("/:id", actualizarObservacionDiaria);

router.patch("/:id/dar-de-baja", darDeBajaObservacionDiaria);  // Ruta para dar de baja

router.patch("/:id/dar-de-alta", darDeAltaObservacionDiaria);  // Ruta para dar de alta

router.delete("/:id", eliminarObservacionDiaria);

module.exports = router;
