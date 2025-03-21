// usuario.routes.js

const express = require("express");
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  darDeBajaUsuario,
  darDeAltaUsuario,
  eliminarUsuario,
} = require("../controllers/usuario.controller"); // Importar el controlador desestructurado

const { verifyAdmin } = require("../middlewares/permissions.js"); // Verificar que el usuario sea admin

const router = express.Router();

// Ruta para obtener todos los usuarios (solo accesible para administradores)
router.get("/", verifyAdmin, obtenerUsuarios);

// Ruta para obtener un usuario por ID
router.get("/:id", verifyAdmin, obtenerUsuarioPorId);

// Ruta para actualizar un usuario por ID
router.put("/:id", verifyAdmin, actualizarUsuario);

// Ruta para dar de baja un usuario por ID
router.patch("/:id/dar-de-baja", verifyAdmin, darDeBajaUsuario);

// Ruta para dar de alta un usuario por ID
router.patch("/:id/dar-de-alta", verifyAdmin, darDeAltaUsuario);

// Ruta para eliminar un usuario por ID
router.delete("/:id", verifyAdmin, eliminarUsuario);

module.exports = router;
