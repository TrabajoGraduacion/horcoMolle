const Enriquecimiento = require('../models/enriquecimiento.model');

// Crear un nuevo enriquecimiento
const crearEnriquecimiento = async (req, res) => {
  try {
    const nuevoEnriquecimiento = new Enriquecimiento(req.body);
    await nuevoEnriquecimiento.save();
    res.status(201).json({ message: 'Enriquecimiento creado exitosamente', enriquecimiento: nuevoEnriquecimiento });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el enriquecimiento', error: error.message });
  }
};

// Obtener todos los enriquecimientos
const obtenerEnriquecimientos = async (req, res) => {
  try {
    const enriquecimientos = await Enriquecimiento.find();
    res.status(200).json(enriquecimientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los enriquecimientos', error: error.message });
  }
};

// Obtener un enriquecimiento por ID
const obtenerEnriquecimientoPorId = async (req, res) => {
  try {
    const enriquecimiento = await Enriquecimiento.findById(req.params.id);
    if (!enriquecimiento) return res.status(404).json({ message: 'Enriquecimiento no encontrado' });
    res.status(200).json(enriquecimiento);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el enriquecimiento', error: error.message });
  }
};

// Actualizar un enriquecimiento
const actualizarEnriquecimiento = async (req, res) => {
  try {
    const enriquecimientoActualizado = await Enriquecimiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enriquecimientoActualizado) {
      return res.status(404).json({ message: 'Enriquecimiento no encontrado' });
    }
    res.status(200).json({ message: 'Enriquecimiento actualizado exitosamente', enriquecimiento: enriquecimientoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el enriquecimiento', error: error.message });
  }
};

// Dar de baja un enriquecimiento
const darDeBajaEnriquecimiento = async (req, res) => {
  try {
    const enriquecimiento = await Enriquecimiento.findById(req.params.id);
    if (!enriquecimiento) return res.status(404).json({ message: 'Enriquecimiento no encontrado' });
    enriquecimiento.activo = false;
    await enriquecimiento.save();
    res.status(200).json({ message: 'Enriquecimiento dado de baja exitosamente', enriquecimiento });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja el enriquecimiento', error: error.message });
  }
};

// Dar de alta un enriquecimiento
const darDeAltaEnriquecimiento = async (req, res) => {
  try {
    const enriquecimiento = await Enriquecimiento.findById(req.params.id);
    if (!enriquecimiento) return res.status(404).json({ message: 'Enriquecimiento no encontrado' });
    enriquecimiento.activo = true;
    await enriquecimiento.save();
    res.status(200).json({ message: 'Enriquecimiento dado de alta exitosamente', enriquecimiento });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta el enriquecimiento', error: error.message });
  }
};

// Eliminar un enriquecimiento
const eliminarEnriquecimiento = async (req, res) => {
  try {
    const enriquecimientoEliminado = await Enriquecimiento.findByIdAndDelete(req.params.id);
    if (!enriquecimientoEliminado) return res.status(404).json({ message: 'Enriquecimiento no encontrado' });
    res.status(200).json({ message: 'Enriquecimiento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el enriquecimiento', error: error.message });
  }
};

module.exports = { 
  crearEnriquecimiento, 
  obtenerEnriquecimientos, 
  obtenerEnriquecimientoPorId, 
  actualizarEnriquecimiento, 
  darDeBajaEnriquecimiento,
  darDeAltaEnriquecimiento,
  eliminarEnriquecimiento 
};
