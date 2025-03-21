const Tratamiento = require('../models/tratamiento.model');

// Crear un nuevo tratamiento
const crearTratamiento = async (req, res) => {
  try {
    const nuevoTratamiento = new Tratamiento(req.body);
    await nuevoTratamiento.save();
    res.status(201).json({ 
      message: 'Tratamiento creado exitosamente', 
      tratamiento: nuevoTratamiento,
      tratamientoId: nuevoTratamiento._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el tratamiento', error: error.message });
  }
};

// Obtener todos los tratamientos
const obtenerTratamientos = async (req, res) => {
  try {
    const tratamientos = await Tratamiento.find();
    res.status(200).json(tratamientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los tratamientos', error: error.message });
  }
};

// Obtener un tratamiento por ID
const obtenerTratamientoPorId = async (req, res) => {
  try {
    const tratamiento = await Tratamiento.findById(req.params.id);
    if (!tratamiento) return res.status(404).json({ message: 'Tratamiento no encontrado' });
    res.status(200).json(tratamiento);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el tratamiento', error: error.message });
  }
};

// Actualizar un tratamiento
const actualizarTratamiento = async (req, res) => {
  try {
    const tratamientoActualizado = await Tratamiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tratamientoActualizado) return res.status(404).json({ message: 'Tratamiento no encontrado' });
    res.status(200).json({ message: 'Tratamiento actualizado exitosamente', tratamiento: tratamientoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el tratamiento', error: error.message });
  }
};

// Dar de baja un tratamiento (cambiar estado a inactivo)
const darDeBajaTratamiento = async (req, res) => {
  try {
    const tratamiento = await Tratamiento.findById(req.params.id);
    if (!tratamiento) return res.status(404).json({ message: 'Tratamiento no encontrado' });
    tratamiento.activo = false;
    await tratamiento.save();
    res.status(200).json({ message: 'Tratamiento dado de baja exitosamente', tratamiento });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja el tratamiento', error: error.message });
  }
};

// Dar de alta un tratamiento (cambiar estado a activo)
const darDeAltaTratamiento = async (req, res) => {
  try {
    const tratamiento = await Tratamiento.findById(req.params.id);
    if (!tratamiento) return res.status(404).json({ message: 'Tratamiento no encontrado' });
    tratamiento.activo = true;
    await tratamiento.save();
    res.status(200).json({ message: 'Tratamiento dado de alta exitosamente', tratamiento });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta el tratamiento', error: error.message });
  }
};

// Eliminar un tratamiento
const eliminarTratamiento = async (req, res) => {
  try {
    const tratamientoEliminado = await Tratamiento.findByIdAndDelete(req.params.id);
    if (!tratamientoEliminado) return res.status(404).json({ message: 'Tratamiento no encontrado' });
    res.status(200).json({ message: 'Tratamiento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el tratamiento', error: error.message });
  }
};

module.exports = {
  crearTratamiento,
  obtenerTratamientos,
  obtenerTratamientoPorId,
  actualizarTratamiento,
  eliminarTratamiento,
  darDeBajaTratamiento, // Agregar función para dar de baja
  darDeAltaTratamiento   // Agregar función para dar de alta
};
