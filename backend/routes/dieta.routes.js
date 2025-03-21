const express = require('express');
const { 
  crearDieta, 
  obtenerDietas, 
  obtenerDietaPorId, 
  actualizarDieta, 
  eliminarDieta, 
  darDeBajaDieta,  // Importar la función para dar de baja
  darDeAltaDieta   // Importar la función para dar de alta
} = require('../controllers/dieta.controller');
const router = express.Router();

router.post('/', crearDieta);

router.get('/', obtenerDietas);

router.get('/:id', obtenerDietaPorId);

router.put('/:id', actualizarDieta);

router.patch('/:id/dar-de-baja', darDeBajaDieta);

router.patch('/:id/dar-de-alta', darDeAltaDieta);

router.delete('/:id', eliminarDieta);

module.exports = router;
