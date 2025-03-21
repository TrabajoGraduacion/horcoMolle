const express = require('express');
const {
  crearRelocalizacion,
  obtenerRelocalizaciones,
  obtenerRelocalizacionPorId,
  actualizarRelocalizacion,
  eliminarRelocalizacion,
  darDeBajaRelocalizacion, // Importar función para dar de baja
  darDeAltaRelocalizacion  // Importar función para dar de alta
} = require('../controllers/relocalizacion.controller');
const router = express.Router();

router.post('/', crearRelocalizacion);

router.get('/', obtenerRelocalizaciones);

router.get('/:id', obtenerRelocalizacionPorId);

router.put('/:id', actualizarRelocalizacion);

router.patch('/:id/dar-de-baja', darDeBajaRelocalizacion);  // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaRelocalizacion);  // Ruta para dar de alta

router.delete('/:id', eliminarRelocalizacion);

module.exports = router;
