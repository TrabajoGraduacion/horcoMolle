const express = require('express');
const { 
  crearIngreso, 
  obtenerIngresos, 
  obtenerIngresoPorId, 
  actualizarIngreso, 
  darDeBajaIngreso,  // Importar la nueva función
  darDeAltaIngreso,  // Importar la nueva función
  eliminarIngreso 
} = require('../controllers/ingreso.controller');

const router = express.Router();

router.post('/', crearIngreso);

router.get('/', obtenerIngresos);

router.get('/:id', obtenerIngresoPorId);

router.put('/:id', actualizarIngreso);

router.patch('/:id/dar-de-baja', darDeBajaIngreso);  // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaIngreso);  // Ruta para dar de alta

router.delete('/:id', eliminarIngreso);

module.exports = router;
