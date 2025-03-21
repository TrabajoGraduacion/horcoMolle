const Usuario = require("../models/usuario.model");

// Obtener todos los usuarios ordenados por rol, apellido y nombre
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, "-contrasena")
      .sort({ rol: 1, apellido: 1, nombre: 1 }); // Ordenar por rol, luego apellido y finalmente nombre
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los usuarios", error });
  }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id, "-contrasena"); // Excluir la contraseña
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuarioActualizado) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json({ mensaje: "Usuario actualizado con éxito", usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Dar de baja un usuario
const darDeBajaUsuario = async (req, res) => {
  try {
    const usuarioBaja = await Usuario.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!usuarioBaja) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json({ mensaje: "Usuario dado de baja con éxito", usuario: usuarioBaja });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Dar de alta un usuario
const darDeAltaUsuario = async (req, res) => {
  try {
    const usuarioAlta = await Usuario.findByIdAndUpdate(req.params.id, { activo: true }, { new: true });
    if (!usuarioAlta) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json({ mensaje: "Usuario dado de alta con éxito", usuario: usuarioAlta });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json({ mensaje: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  darDeBajaUsuario,
  darDeAltaUsuario,
  eliminarUsuario,
};
