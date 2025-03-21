const express = require("express");
const {
  crearDiagnostico,
  obtenerDiagnosticos,
  obtenerDiagnosticoPorId,
  actualizarDiagnostico,
  darDeBajaDiagnostico,
  darDeAltaDiagnostico,
  eliminarDiagnostico,
} = require("../controllers/diagnostico.controller");
const router = express.Router();

router.post("/", crearDiagnostico);

router.get("/", obtenerDiagnosticos);

router.get("/:id", obtenerDiagnosticoPorId);

router.put("/:id", actualizarDiagnostico);

router.patch("/:id/dar-de-baja", darDeBajaDiagnostico);

router.patch("/:id/dar-de-alta", darDeAltaDiagnostico);

router.delete("/:id", eliminarDiagnostico);

module.exports = router;
