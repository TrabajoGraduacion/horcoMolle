const express = require('express');
const { 
  crearEnriquecimiento, 
  obtenerEnriquecimientos, 
  obtenerEnriquecimientoPorId, 
  actualizarEnriquecimiento, 
  darDeBajaEnriquecimiento,  // Importar la función de dar de baja
  darDeAltaEnriquecimiento,  // Importar la función de dar de alta
  eliminarEnriquecimiento 
} = require('../controllers/enriquecimiento.controller');

const router = express.Router();

router.post('/', crearEnriquecimiento);

router.get('/', obtenerEnriquecimientos);

router.get('/:id', obtenerEnriquecimientoPorId);

router.put('/:id', actualizarEnriquecimiento);

router.patch('/:id/dar-de-baja', darDeBajaEnriquecimiento);

router.patch('/:id/dar-de-alta', darDeAltaEnriquecimiento);

router.delete('/:id', eliminarEnriquecimiento);

module.exports = router;
