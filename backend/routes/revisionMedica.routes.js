const express = require('express');
const {
  crearRevisionMedica,
  obtenerRevisionesMedicas,
  obtenerRevisionMedicaPorId,
  actualizarRevisionMedica,
  eliminarRevisionMedica,
  darDeBajaRevisionMedica, // Importar función para dar de baja
  darDeAltaRevisionMedica  // Importar función para dar de alta
} = require('../controllers/revisionMedica.controller');
const router = express.Router();

router.post('/', crearRevisionMedica);

router.get('/', obtenerRevisionesMedicas);

router.get('/:id', obtenerRevisionMedicaPorId);

router.put('/:id', actualizarRevisionMedica);

router.patch('/:id/dar-de-baja', darDeBajaRevisionMedica);  // Ruta para dar de baja

router.patch('/:id/dar-de-alta', darDeAltaRevisionMedica);  // Ruta para dar de alta

router.delete('/:id', eliminarRevisionMedica);

module.exports = router;
