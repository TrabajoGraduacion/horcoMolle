const express = require('express');
const {
  crearAnestesia,
  obtenerAnestesias,
  obtenerAnestesiaPorId,
  actualizarAnestesia,
  darDeBajaAnestesia,
  darDeAltaAnestesia,
  eliminarAnestesia
} = require('../controllers/anestesia.controller');
const router = express.Router();

// Ruta para crear una nueva anestesia
router.post('/', crearAnestesia);

// Ruta para obtener todas las anestesias
router.get('/', obtenerAnestesias);

// Ruta para obtener una anestesia por ID
router.get('/:id', obtenerAnestesiaPorId);

// Ruta para actualizar una anestesia por ID
router.put('/:id', actualizarAnestesia);

// Ruta para dar de baja una anestesia por ID (estado inactivo)
router.patch('/:id/dar-de-baja', darDeBajaAnestesia);

// Ruta para dar de alta una anestesia por ID (estado activo)
router.patch('/:id/dar-de-alta', darDeAltaAnestesia);

// Ruta para eliminar una anestesia por ID
router.delete('/:id', eliminarAnestesia);

module.exports = router;
