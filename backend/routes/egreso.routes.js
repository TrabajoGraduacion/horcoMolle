const express = require('express');
const {
  crearEgreso,
  obtenerEgresos,
  obtenerEgresoPorId,
  actualizarEgreso,
  darDeBajaEgreso,  // Importar la función para dar de baja
  darDeAltaEgreso,  // Importar la función para dar de alta
  eliminarEgreso
} = require('../controllers/egreso.controller');

const router = express.Router();

router.post('/', crearEgreso);

router.get('/', obtenerEgresos);

router.get('/:id', obtenerEgresoPorId);

router.put('/:id', actualizarEgreso);

router.patch('/:id/dar-de-baja', darDeBajaEgreso);

router.patch('/:id/dar-de-alta', darDeAltaEgreso);

router.delete('/:id', eliminarEgreso);

module.exports = router;
