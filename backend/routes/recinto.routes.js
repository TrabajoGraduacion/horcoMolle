const express = require('express');
const { 
  crearRecinto, 
  obtenerRecintos, 
  obtenerRecintoPorId, 
  actualizarRecinto, 
  eliminarRecinto, 
  darDeBajaRecinto, // Importar la nueva función
  darDeAltaRecinto  // Importar la nueva función
} = require('../controllers/recinto.controller');
const router = express.Router();

router.post('/', crearRecinto);

router.get('/', obtenerRecintos);

router.get('/:id', obtenerRecintoPorId);

router.put('/:id', actualizarRecinto);

router.patch('/:id/dar-de-baja', darDeBajaRecinto);  // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaRecinto);  // Ruta para dar de alta

router.delete('/:id', eliminarRecinto);

module.exports = router;
