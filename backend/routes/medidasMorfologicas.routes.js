const express = require('express');
const { 
  crearMedidasMorfologicas, 
  obtenerMedidasMorfologicas, 
  obtenerMedidasMorfologicasPorId, 
  actualizarMedidasMorfologicas, 
  eliminarMedidasMorfologicas, 
  darDeBajaMedidasMorfologicas,  // Importar la nueva función
  darDeAltaMedidasMorfologicas   // Importar la nueva función
} = require('../controllers/medidasMorfologicas.controller');

const router = express.Router();

router.post('/', crearMedidasMorfologicas);

router.get('/', obtenerMedidasMorfologicas);

router.get('/:id', obtenerMedidasMorfologicasPorId);

router.put('/:id', actualizarMedidasMorfologicas);

router.patch('/:id/dar-de-baja', darDeBajaMedidasMorfologicas);  // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaMedidasMorfologicas);  // Ruta para dar de alta

router.delete('/:id', eliminarMedidasMorfologicas);

module.exports = router;
