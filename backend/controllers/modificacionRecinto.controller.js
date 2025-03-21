const ModificacionRecinto = require('../models/modificacionRecinto.model');

// Crear una modificación de recinto
const crearModificacionRecinto = async (req, res) => {
  try {
    const nuevaModificacion = new ModificacionRecinto(req.body);
    await nuevaModificacion.save();
    res.status(201).json({ message: 'Modificación creada exitosamente', modificacion: nuevaModificacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la modificación', error: error.message });
  }
};

// Obtener todas las modificaciones de recinto
const obtenerModificacionesRecinto = async (req, res) => {
  try {
    const modificaciones = await ModificacionRecinto.find()
      .populate('recintoId', 'nombre')
      .lean();

    const modificacionesFormateadas = modificaciones.map(modificacion => ({
      ...modificacion,
      nombreRecinto: modificacion.recintoId.nombre,
      recintoId: modificacion.recintoId._id
    }));

    res.status(200).json(modificacionesFormateadas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las modificaciones', error: error.message });
  }
};

// Obtener una modificación de recinto por ID
const obtenerModificacionRecintoPorId = async (req, res) => {
  try {
    const modificacion = await ModificacionRecinto.findById(req.params.id);
    if (!modificacion) return res.status(404).json({ message: 'Modificación no encontrada' });
    res.status(200).json(modificacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la modificación', error: error.message });
  }
};

// Actualizar una modificación de recinto
const actualizarModificacionRecinto = async (req, res) => {
  try {
    const modificacionActualizada = await ModificacionRecinto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!modificacionActualizada) return res.status(404).json({ message: 'Modificación no encontrada' });
    res.status(200).json({ message: 'Modificación actualizada exitosamente', modificacion: modificacionActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la modificación', error: error.message });
  }
};

// Dar de baja una modificación de recinto (cambiar estado a inactivo)
const darDeBajaModificacionRecinto = async (req, res) => {
  try {
    const modificacion = await ModificacionRecinto.findById(req.params.id);
    if (!modificacion) return res.status(404).json({ message: 'Modificación no encontrada' });
    modificacion.activo = false;
    await modificacion.save();
    res.status(200).json({ message: 'Modificación dada de baja exitosamente', modificacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja la modificación', error: error.message });
  }
};

// Dar de alta una modificación de recinto (cambiar estado a activo)
const darDeAltaModificacionRecinto = async (req, res) => {
  try {
    const modificacion = await ModificacionRecinto.findById(req.params.id);
    if (!modificacion) return res.status(404).json({ message: 'Modificación no encontrada' });
    modificacion.activo = true;
    await modificacion.save();
    res.status(200).json({ message: 'Modificación dada de alta exitosamente', modificacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta la modificación', error: error.message });
  }
};

// Eliminar una modificación de recinto
const eliminarModificacionRecinto = async (req, res) => {
  try {
    const modificacionEliminada = await ModificacionRecinto.findByIdAndDelete(req.params.id);
    if (!modificacionEliminada) return res.status(404).json({ message: 'Modificación no encontrada' });
    res.status(200).json({ message: 'Modificación eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la modificación', error: error.message });
  }
};

module.exports = {
  crearModificacionRecinto,
  obtenerModificacionesRecinto,
  obtenerModificacionRecintoPorId,
  actualizarModificacionRecinto,
  darDeBajaModificacionRecinto,
  darDeAltaModificacionRecinto,
  eliminarModificacionRecinto
};
