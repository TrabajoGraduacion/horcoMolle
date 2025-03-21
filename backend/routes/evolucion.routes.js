const express = require('express');
const { 
  crearEvolucion, 
  obtenerEvoluciones, 
  obtenerEvolucionPorId, 
  actualizarEvolucion, 
  darDeBajaEvolucion,  // Importar la nueva función
  darDeAltaEvolucion,  // Importar la nueva función
  eliminarEvolucion 
} = require('../controllers/evolucion.controller');

const router = express.Router();

router.post('/', crearEvolucion);

router.get('/', obtenerEvoluciones);

router.get('/:id', obtenerEvolucionPorId);

router.put('/:id', actualizarEvolucion);

router.patch('/:id/dar-de-baja', darDeBajaEvolucion); // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaEvolucion); // Ruta para dar de alta

router.delete('/:id', eliminarEvolucion);

module.exports = router;
