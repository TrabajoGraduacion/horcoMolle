const express = require('express');
const { obtenerEventosRecintos, obtenerEventosPorMes } = require('../controllers/reportes.controller');

const router = express.Router();

router.get('/eventosAnimalRecinto', obtenerEventosRecintos);
router.get('/eventosPorMes', obtenerEventosPorMes);

module.exports = router;