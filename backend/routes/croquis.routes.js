const express = require('express');
const { subirCroquis, eliminarCroquis, obtenerCroquis } = require('../controllers/croquis.controller');
const router = express.Router();

// Ya no necesitas configurar `fileUpload` aquí porque ya está en `app.js`

// Ruta para subir croquis
router.post('/subir', subirCroquis);

// Ruta para eliminar croquis
router.delete('/eliminar', eliminarCroquis);

router.get('/', obtenerCroquis);

module.exports = router;
