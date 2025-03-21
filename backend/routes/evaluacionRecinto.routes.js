const express = require('express');
const { 
  crearEvaluacionRecinto, 
  obtenerEvaluacionesRecinto, 
  obtenerEvaluacionRecintoPorId, 
  actualizarEvaluacionRecinto, 
  darDeBajaEvaluacionRecinto, // Importar la función de dar de baja
  darDeAltaEvaluacionRecinto, // Importar la función de dar de alta
  eliminarEvaluacionRecinto 
} = require('../controllers/evaluacionRecinto.controller');

const router = express.Router();

router.post('/', crearEvaluacionRecinto);

router.get('/', obtenerEvaluacionesRecinto);

router.get('/:id', obtenerEvaluacionRecintoPorId);

router.put('/:id', actualizarEvaluacionRecinto);

router.patch('/:id/dar-de-baja', darDeBajaEvaluacionRecinto);

router.patch('/:id/dar-de-alta', darDeAltaEvaluacionRecinto);

router.delete('/:id', eliminarEvaluacionRecinto);

module.exports = router;
