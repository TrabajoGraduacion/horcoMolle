const EvaluacionRecinto = require('../models/evaluacionRecinto.model');

// Crear una evaluación de recinto
const crearEvaluacionRecinto = async (req, res) => {
  try {
    const nuevaEvaluacion = new EvaluacionRecinto(req.body);
    await nuevaEvaluacion.save();
    res.status(201).json({ message: 'Evaluación creada exitosamente', evaluacion: nuevaEvaluacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la evaluación', error: error.message });
  }
};

// Obtener todas las evaluaciones de recinto
const obtenerEvaluacionesRecinto = async (req, res) => {
  try {
    const evaluaciones = await EvaluacionRecinto.find()
      .populate('recintoId', 'nombre')
      .lean();

    const evaluacionesFormateadas = evaluaciones.map(evaluacion => ({
      ...evaluacion,
      nombreRecinto: evaluacion.recintoId.nombre,
      recintoId: evaluacion.recintoId._id
    }));

    res.status(200).json(evaluacionesFormateadas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las evaluaciones', error: error.message });
  }
};

// Obtener una evaluación de recinto por ID
const obtenerEvaluacionRecintoPorId = async (req, res) => {
  try {
    const evaluacion = await EvaluacionRecinto.findById(req.params.id)
      .populate('recintoId', 'nombre')
      .lean();

    if (!evaluacion) return res.status(404).json({ message: 'Evaluación no encontrada' });

    const evaluacionFormateada = {
      ...evaluacion,
      nombreRecinto: evaluacion.recintoId.nombre,
      recintoId: evaluacion.recintoId._id
    };

    res.status(200).json(evaluacionFormateada);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la evaluación', error: error.message });
  }
};

// Actualizar una evaluación de recinto
const actualizarEvaluacionRecinto = async (req, res) => {
  try {
    const evaluacionActualizada = await EvaluacionRecinto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!evaluacionActualizada) return res.status(404).json({ message: 'Evaluación no encontrada' });
    res.status(200).json({ message: 'Evaluación actualizada exitosamente', evaluacion: evaluacionActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la evaluación', error: error.message });
  }
};

// Dar de baja una evaluación de recinto
const darDeBajaEvaluacionRecinto = async (req, res) => {
  try {
    const evaluacion = await EvaluacionRecinto.findById(req.params.id);
    if (!evaluacion) return res.status(404).json({ message: 'Evaluación no encontrada' });
    evaluacion.activo = false;
    await evaluacion.save();
    res.status(200).json({ message: 'Evaluación dada de baja exitosamente', evaluacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja la evaluación', error: error.message });
  }
};

// Dar de alta una evaluación de recinto
const darDeAltaEvaluacionRecinto = async (req, res) => {
  try {
    const evaluacion = await EvaluacionRecinto.findById(req.params.id);
    if (!evaluacion) return res.status(404).json({ message: 'Evaluación no encontrada' });
    evaluacion.activo = true;
    await evaluacion.save();
    res.status(200).json({ message: 'Evaluación dada de alta exitosamente', evaluacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta la evaluación', error: error.message });
  }
};

// Eliminar una evaluación de recinto
const eliminarEvaluacionRecinto = async (req, res) => {
  try {
    const evaluacionEliminada = await EvaluacionRecinto.findByIdAndDelete(req.params.id);
    if (!evaluacionEliminada) return res.status(404).json({ message: 'Evaluación no encontrada' });
    res.status(200).json({ message: 'Evaluación eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la evaluación', error: error.message });
  }
};

module.exports = {
  crearEvaluacionRecinto,
  obtenerEvaluacionesRecinto,
  obtenerEvaluacionRecintoPorId,
  actualizarEvaluacionRecinto,
  darDeBajaEvaluacionRecinto,
  darDeAltaEvaluacionRecinto,
  eliminarEvaluacionRecinto
};
