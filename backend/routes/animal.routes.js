const express = require('express');
const { 
  crearAnimal, 
  obtenerAnimales, 
  obtenerAnimalPorId, 
  actualizarAnimal, 
  eliminarAnimal, 
  darDeBajaAnimal, 
  darDeAltaAnimal 
} = require('../controllers/animal.controller');

const router = express.Router();

router.post('/', crearAnimal);

router.get('/', obtenerAnimales);

router.get('/:id', obtenerAnimalPorId);

router.put('/:id', actualizarAnimal);

router.patch('/:id/dar-de-baja', darDeBajaAnimal);

router.patch('/:id/dar-de-alta', darDeAltaAnimal);

router.delete('/:id', eliminarAnimal);

module.exports = router;
