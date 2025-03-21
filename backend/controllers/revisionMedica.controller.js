const RevisionMedica = require('../models/revisionMedica.model');

// Crear una nueva revisión médica
const crearRevisionMedica = async (req, res) => {
  try {
    const nuevaRevision = new RevisionMedica(req.body);
    await nuevaRevision.save();
    res.status(201).json({ 
      message: 'Revisión médica creada exitosamente', 
      revision: nuevaRevision,
      revisionMedicaId: nuevaRevision._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la revisión médica', error: error.message });
  }
};

// Obtener todas las revisiones médicas
const obtenerRevisionesMedicas = async (req, res) => {
  try {
    const revisiones = await RevisionMedica.find();
    res.status(200).json(revisiones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las revisiones médicas', error: error.message });
  }
};

// Obtener una revisión médica por ID
const obtenerRevisionMedicaPorId = async (req, res) => {
  try {
    const revision = await RevisionMedica.findById(req.params.id);
    if (!revision) return res.status(404).json({ message: 'Revisión médica no encontrada' });
    res.status(200).json(revision);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la revisión médica', error: error.message });
  }
};

// Actualizar una revisión médica
const actualizarRevisionMedica = async (req, res) => {
  try {
    const revisionActualizada = await RevisionMedica.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!revisionActualizada) return res.status(404).json({ message: 'Revisión médica no encontrada' });
    res.status(200).json({ message: 'Revisión médica actualizada exitosamente', revision: revisionActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la revisión médica', error: error.message });
  }
};

// Dar de baja una revisión médica (cambiar estado a inactivo)
const darDeBajaRevisionMedica = async (req, res) => {
  try {
    const revision = await RevisionMedica.findById(req.params.id);
    if (!revision) return res.status(404).json({ message: 'Revisión médica no encontrada' });
    revision.activo = false;
    await revision.save();
    res.status(200).json({ message: 'Revisión médica dada de baja exitosamente', revision });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja la revisión médica', error: error.message });
  }
};

// Dar de alta una revisión médica (cambiar estado a activo)
const darDeAltaRevisionMedica = async (req, res) => {
  try {
    const revision = await RevisionMedica.findById(req.params.id);
    if (!revision) return res.status(404).json({ message: 'Revisión médica no encontrada' });
    revision.activo = true;
    await revision.save();
    res.status(200).json({ message: 'Revisión médica dada de alta exitosamente', revision });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta la revisión médica', error: error.message });
  }
};

// Eliminar una revisión médica
const eliminarRevisionMedica = async (req, res) => {
  try {
    const revisionEliminada = await RevisionMedica.findByIdAndDelete(req.params.id);
    if (!revisionEliminada) return res.status(404).json({ message: 'Revisión médica no encontrada' });
    res.status(200).json({ message: 'Revisión médica eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la revisión médica', error: error.message });
  }
};

module.exports = {
  crearRevisionMedica,
  obtenerRevisionesMedicas,
  obtenerRevisionMedicaPorId,
  actualizarRevisionMedica,
  eliminarRevisionMedica,
  darDeBajaRevisionMedica, // Agregar función para dar de baja
  darDeAltaRevisionMedica   // Agregar función para dar de alta
};
