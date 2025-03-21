const express = require('express');
const {
  crearOdontograma,
  obtenerOdontogramas,
  obtenerOdontogramaPorId,
  actualizarOdontograma,
  eliminarOdontograma,
  darDeBajaOdontograma, // Importar la nueva función
  darDeAltaOdontograma  // Importar la nueva función
} = require('../controllers/odontograma.controller');
const router = express.Router();

router.post('/', crearOdontograma);

router.get('/', obtenerOdontogramas);

router.get('/:id', obtenerOdontogramaPorId);

router.put('/:id', actualizarOdontograma);

router.patch('/:id/dar-de-baja', darDeBajaOdontograma);  // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaOdontograma);  // Ruta para dar de alta

router.delete('/:id', eliminarOdontograma);

module.exports = router;
