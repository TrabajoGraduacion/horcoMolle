const express = require('express');
const {
  crearFichaClinica,
  obtenerFichasClinicas,
  obtenerFichaClinicaPorId,
  actualizarFichaClinica,
  darDeBajaFichaClinica,  // Importar la nueva función
  darDeAltaFichaClinica,  // Importar la nueva función
  eliminarFichaClinica
} = require('../controllers/fichaClinica.controller');

const router = express.Router();

router.post('/', crearFichaClinica);

router.get('/', obtenerFichasClinicas);

router.get('/:id', obtenerFichaClinicaPorId);

router.put('/:id', actualizarFichaClinica);

router.patch('/:id/dar-de-baja', darDeBajaFichaClinica);  // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaFichaClinica);  // Ruta para dar de alta

router.delete('/:id', eliminarFichaClinica);

module.exports = router;
