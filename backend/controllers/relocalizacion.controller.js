const Relocalizacion = require('../models/relocalizacion.model');

// Crear una relocalización
const crearRelocalizacion = async (req, res) => {
  try {
    const nuevaRelocalizacion = new Relocalizacion(req.body);
    await nuevaRelocalizacion.save();
    res.status(201).json({ message: 'Relocalización creada exitosamente', relocalizacion: nuevaRelocalizacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la relocalización', error: error.message });
  }
};

// Obtener todas las relocalizaciones
const obtenerRelocalizaciones = async (req, res) => {
  try {
    const relocalizaciones = await Relocalizacion.find()
      .populate('animalId', 'nombreInstitucional')
      .populate('recintoAnterior', 'nombre')
      .populate('recintoNuevo', 'nombre')
      .lean();

    const relocalizacionesFormateadas = relocalizaciones.map(relocalizacion => ({
      ...relocalizacion,
      nombreInstitucionalAnimal: relocalizacion.animalId?.nombreInstitucional || null,
      nombreRecintoAnterior: relocalizacion.recintoAnterior?.nombre || null,
      nombreRecintoNuevo: relocalizacion.recintoNuevo?.nombre || null
    }));

    res.status(200).json(relocalizacionesFormateadas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las relocalizaciones', error: error.message });
  }
};

// Obtener una relocalización por ID
const obtenerRelocalizacionPorId = async (req, res) => {
  try {
    const relocalizacion = await Relocalizacion.findById(req.params.id)
      .populate('animalId', 'nombreInstitucional')
      .populate('recintoAnterior', 'nombre')
      .populate('recintoNuevo', 'nombre')
      .lean();

    if (!relocalizacion) {
      return res.status(404).json({ message: 'Relocalización no encontrada' });
    }

    const relocalizacionFormateada = {
      ...relocalizacion,
      nombreInstitucionalAnimal: relocalizacion.animalId?.nombreInstitucional || null,
      nombreRecintoAnterior: relocalizacion.recintoAnterior?.nombre || null,
      nombreRecintoNuevo: relocalizacion.recintoNuevo?.nombre || null
    };

    res.status(200).json(relocalizacionFormateada);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la relocalización', error: error.message });
  }
};

// Actualizar una relocalización
const actualizarRelocalizacion = async (req, res) => {
  try {
    const relocalizacionActualizada = await Relocalizacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!relocalizacionActualizada) return res.status(404).json({ message: 'Relocalización no encontrada' });
    res.status(200).json({ message: 'Relocalización actualizada exitosamente', relocalizacion: relocalizacionActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la relocalización', error: error.message });
  }
};

// Dar de baja una relocalización (cambiar estado a inactivo)
const darDeBajaRelocalizacion = async (req, res) => {
  try {
    const relocalizacion = await Relocalizacion.findById(req.params.id);
    if (!relocalizacion) return res.status(404).json({ message: 'Relocalización no encontrada' });
    relocalizacion.activo = false;
    await relocalizacion.save();
    res.status(200).json({ message: 'Relocalización dada de baja exitosamente', relocalizacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja la relocalización', error: error.message });
  }
};

// Dar de alta una relocalización (cambiar estado a activo)
const darDeAltaRelocalizacion = async (req, res) => {
  try {
    const relocalizacion = await Relocalizacion.findById(req.params.id);
    if (!relocalizacion) return res.status(404).json({ message: 'Relocalización no encontrada' });
    relocalizacion.activo = true;
    await relocalizacion.save();
    res.status(200).json({ message: 'Relocalización dada de alta exitosamente', relocalizacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta la relocalización', error: error.message });
  }
};

// Eliminar una relocalización
const eliminarRelocalizacion = async (req, res) => {
  try {
    const relocalizacionEliminada = await Relocalizacion.findByIdAndDelete(req.params.id);
    if (!relocalizacionEliminada) return res.status(404).json({ message: 'Relocalización no encontrada' });
    res.status(200).json({ message: 'Relocalización eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la relocalización', error: error.message });
  }
};

module.exports = {
  crearRelocalizacion,
  obtenerRelocalizaciones,
  obtenerRelocalizacionPorId,
  actualizarRelocalizacion,
  eliminarRelocalizacion,
  darDeBajaRelocalizacion, // Agregar función para dar de baja
  darDeAltaRelocalizacion   // Agregar función para dar de alta
};
