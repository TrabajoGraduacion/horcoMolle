const Anestesia = require('../models/anestesia.model');

// Crear una nueva anestesia
const crearAnestesia = async (req, res) => {
  try {
    const nuevaAnestesia = new Anestesia(req.body);
    await nuevaAnestesia.save();
    res.status(201).json({ 
      message: 'Anestesia creada exitosamente', 
      anestesia: nuevaAnestesia,
      anestesiaId: nuevaAnestesia._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la anestesia', error: error.message });
  }
};

// Obtener todas las anestesias
const obtenerAnestesias = async (req, res) => {
  try {
    const anestesias = await Anestesia.find();
    res.status(200).json(anestesias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las anestesias', error: error.message });
  }
};

// Obtener una anestesia por ID
const obtenerAnestesiaPorId = async (req, res) => {
  try {
    const anestesia = await Anestesia.findById(req.params.id);
    if (!anestesia) return res.status(404).json({ message: 'Anestesia no encontrada' });
    res.status(200).json(anestesia);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la anestesia', error: error.message });
  }
};

// Actualizar una anestesia por ID
const actualizarAnestesia = async (req, res) => {
  try {
    const anestesiaActualizada = await Anestesia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!anestesiaActualizada) return res.status(404).json({ message: 'Anestesia no encontrada' });
    res.status(200).json({ message: 'Anestesia actualizada exitosamente', anestesia: anestesiaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la anestesia', error: error.message });
  }
};

// Dar de baja una anestesia (cambiar estado a inactivo)
const darDeBajaAnestesia = async (req, res) => {
  try {
    const anestesiaInactiva = await Anestesia.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!anestesiaInactiva) return res.status(404).json({ message: 'Anestesia no encontrada' });
    res.status(200).json({ message: 'Anestesia dada de baja exitosamente', anestesia: anestesiaInactiva });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja la anestesia', error: error.message });
  }
};

// Dar de alta una anestesia (cambiar estado a activo)
const darDeAltaAnestesia = async (req, res) => {
  try {
    const anestesiaActiva = await Anestesia.findByIdAndUpdate(req.params.id, { activo: true }, { new: true });
    if (!anestesiaActiva) return res.status(404).json({ message: 'Anestesia no encontrada' });
    res.status(200).json({ message: 'Anestesia dada de alta exitosamente', anestesia: anestesiaActiva });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta la anestesia', error: error.message });
  }
};

// Eliminar una anestesia por ID
const eliminarAnestesia = async (req, res) => {
  try {
    const anestesiaEliminada = await Anestesia.findByIdAndDelete(req.params.id);
    if (!anestesiaEliminada) return res.status(404).json({ message: 'Anestesia no encontrada' });
    res.status(200).json({ message: 'Anestesia eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la anestesia', error: error.message });
  }
};

module.exports = {
  crearAnestesia,
  obtenerAnestesias,
  obtenerAnestesiaPorId,
  actualizarAnestesia,
  darDeBajaAnestesia,
  darDeAltaAnestesia,
  eliminarAnestesia,
};
