const express = require('express');
const {
  crearTratamiento,
  obtenerTratamientos,
  obtenerTratamientoPorId,
  actualizarTratamiento,
  eliminarTratamiento,
  darDeBajaTratamiento, // Importar función para dar de baja
  darDeAltaTratamiento  // Importar función para dar de alta
} = require('../controllers/tratamiento.controller');
const router = express.Router();

router.post('/', crearTratamiento);

router.get('/', obtenerTratamientos);

router.get('/:id', obtenerTratamientoPorId);

router.put('/:id', actualizarTratamiento);

router.patch('/:id/dar-de-baja', darDeBajaTratamiento);  // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaTratamiento);  // Ruta para dar de alta

router.delete('/:id', eliminarTratamiento);

module.exports = router;
