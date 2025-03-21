const ObservacionDiaria = require("../models/observacionDiaria.model");

// Crear una nueva observación diaria
const crearObservacionDiaria = async (req, res) => {
  try {
    const nuevaObservacion = new ObservacionDiaria(req.body);
    await nuevaObservacion.save();
    res.status(201).json({
      message: "Observación diaria creada exitosamente",
      observacion: nuevaObservacion,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la observación diaria",
      error: error.message,
    });
  }
};

// Obtener todas las observaciones diarias
const obtenerObservacionesDiarias = async (req, res) => {
  try {
    const observaciones = await ObservacionDiaria.find()
      .populate('animalId', 'nombreInstitucional')
      .lean();

    const observacionesFormateadas = observaciones.map(observacion => ({
      ...observacion,
      nombreInstitucionalAnimal: observacion.animalId ? observacion.animalId.nombreInstitucional : null,
      animalId: observacion.animalId ? observacion.animalId._id : null
    }));

    res.status(200).json(observacionesFormateadas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las observaciones diarias",
      error: error.message,
    });
  }
};

// Obtener una observación diaria por ID
const obtenerObservacionDiariaPorId = async (req, res) => {
  try {
    const observacion = await ObservacionDiaria.findById(req.params.id)
      .populate('animalId', 'nombreInstitucional')
      .lean();

    if (!observacion) {
      return res.status(404).json({ message: "Observación diaria no encontrada" });
    }

    const observacionFormateada = {
      ...observacion,
      nombreInstitucionalAnimal: observacion.animalId ? observacion.animalId.nombreInstitucional : null,
      animalId: observacion.animalId ? observacion.animalId._id : null
    };

    res.status(200).json(observacionFormateada);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la observación diaria",
      error: error.message,
    });
  }
};

// Actualizar una observación diaria por ID
const actualizarObservacionDiaria = async (req, res) => {
  try {
    const observacionActualizada = await ObservacionDiaria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!observacionActualizada) {
      return res.status(404).json({ message: "Observación diaria no encontrada" });
    }
    res.status(200).json({
      message: "Observación diaria actualizada exitosamente",
      observacion: observacionActualizada,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la observación diaria",
      error: error.message,
    });
  }
};

// Dar de baja una observación diaria (cambiar estado a inactivo)
const darDeBajaObservacionDiaria = async (req, res) => {
  try {
    const observacion = await ObservacionDiaria.findById(req.params.id);
    if (!observacion) return res.status(404).json({ message: "Observación diaria no encontrada" });
    observacion.activo = false;
    await observacion.save();
    res.status(200).json({ message: "Observación diaria dada de baja exitosamente", observacion });
  } catch (error) {
    res.status(500).json({ message: "Error al dar de baja la observación diaria", error: error.message });
  }
};

// Dar de alta una observación diaria (cambiar estado a activo)
const darDeAltaObservacionDiaria = async (req, res) => {
  try {
    const observacion = await ObservacionDiaria.findById(req.params.id);
    if (!observacion) return res.status(404).json({ message: "Observación diaria no encontrada" });
    observacion.activo = true;
    await observacion.save();
    res.status(200).json({ message: "Observación diaria dada de alta exitosamente", observacion });
  } catch (error) {
    res.status(500).json({ message: "Error al dar de alta la observación diaria", error: error.message });
  }
};

// Eliminar una observación diaria por ID
const eliminarObservacionDiaria = async (req, res) => {
  try {
    const observacionEliminada = await ObservacionDiaria.findByIdAndDelete(req.params.id);
    if (!observacionEliminada) {
      return res.status(404).json({ message: "Observación diaria no encontrada" });
    }
    res.status(200).json({ message: "Observación diaria eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la observación diaria",
      error: error.message,
    });
  }
};

module.exports = {
  crearObservacionDiaria,
  obtenerObservacionesDiarias,
  obtenerObservacionDiariaPorId,
  actualizarObservacionDiaria,
  darDeBajaObservacionDiaria, // Exportar la nueva función
  darDeAltaObservacionDiaria, // Exportar la nueva función
  eliminarObservacionDiaria,
};
