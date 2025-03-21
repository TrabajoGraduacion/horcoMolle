const Evolucion = require('../models/evolucion.model');

const crearEvolucion = async (req, res) => {
  try {
    const nuevaEvolucion = new Evolucion(req.body);
    await nuevaEvolucion.save();
    res.status(201).json({ 
      message: 'Evolución creada exitosamente', 
      evolucion: nuevaEvolucion,
      evolucionId: nuevaEvolucion._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la evolución', error: error.message });
  }
};

const obtenerEvoluciones = async (req, res) => {
  try {
    const evoluciones = await Evolucion.find();
    res.status(200).json(evoluciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las evoluciones', error: error.message });
  }
};

const obtenerEvolucionPorId = async (req, res) => {
  try {
    const evolucion = await Evolucion.findById(req.params.id);
    if (!evolucion) return res.status(404).json({ message: 'Evolución no encontrada' });
    res.status(200).json(evolucion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la evolución', error: error.message });
  }
};

const actualizarEvolucion = async (req, res) => {
  try {
    const evolucionActualizada = await Evolucion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!evolucionActualizada) return res.status(404).json({ message: 'Evolución no encontrada' });
    res.status(200).json({ message: 'Evolución actualizada exitosamente', evolucion: evolucionActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la evolución', error: error.message });
  }
};

// Dar de baja una evolución (cambiar estado a inactivo)
const darDeBajaEvolucion = async (req, res) => {
  try {
    const evolucion = await Evolucion.findById(req.params.id);
    if (!evolucion) return res.status(404).json({ message: 'Evolución no encontrada' });
    evolucion.activo = false;
    await evolucion.save();
    res.status(200).json({ message: 'Evolución dada de baja exitosamente', evolucion });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja la evolución', error: error.message });
  }
};

// Dar de alta una evolución (cambiar estado a activo)
const darDeAltaEvolucion = async (req, res) => {
  try {
    const evolucion = await Evolucion.findById(req.params.id);
    if (!evolucion) return res.status(404).json({ message: 'Evolución no encontrada' });
    evolucion.activo = true;
    await evolucion.save();
    res.status(200).json({ message: 'Evolución dada de alta exitosamente', evolucion });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta la evolución', error: error.message });
  }
};

const eliminarEvolucion = async (req, res) => {
  try {
    const evolucionEliminada = await Evolucion.findByIdAndDelete(req.params.id);
    if (!evolucionEliminada) return res.status(404).json({ message: 'Evolución no encontrada' });
    res.status(200).json({ message: 'Evolución eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la evolución', error: error.message });
  }
};

module.exports = { 
  crearEvolucion, 
  obtenerEvoluciones, 
  obtenerEvolucionPorId, 
  actualizarEvolucion, 
  darDeBajaEvolucion,  // Exportar la nueva función
  darDeAltaEvolucion,  // Exportar la nueva función
  eliminarEvolucion 
};
