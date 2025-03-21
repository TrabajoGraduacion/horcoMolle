const express = require('express');
const { 
  crearModificacionRecinto, 
  obtenerModificacionesRecinto, 
  obtenerModificacionRecintoPorId, 
  actualizarModificacionRecinto, 
  eliminarModificacionRecinto,
  darDeBajaModificacionRecinto,  // Importar la nueva función
  darDeAltaModificacionRecinto    // Importar la nueva función
} = require('../controllers/modificacionRecinto.controller');
const router = express.Router();

router.post('/', crearModificacionRecinto);

router.get('/', obtenerModificacionesRecinto);

router.get('/:id', obtenerModificacionRecintoPorId);

router.put('/:id', actualizarModificacionRecinto);

router.patch('/:id/dar-de-baja', darDeBajaModificacionRecinto);  // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaModificacionRecinto);  // Ruta para dar de alta

router.delete('/:id', eliminarModificacionRecinto);

module.exports = router;
