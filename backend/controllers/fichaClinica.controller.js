const FichaClinica = require('../models/fichaClinica.model');

// Crear una nueva ficha clínica
const crearFichaClinica = async (req, res) => {
  try {
    const nuevaFichaClinica = new FichaClinica(req.body);
    await nuevaFichaClinica.save();
    
    res.status(201).json({ 
      message: 'Ficha clínica creada exitosamente', 
      fichaClinica: nuevaFichaClinica,
      fichaClinicaId: nuevaFichaClinica._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la ficha clínica', error: error.message });
  }
};

// Obtener todas las fichas clínicas
const obtenerFichasClinicas = async (req, res) => {
  try {
    const fichasClinicas = await FichaClinica.find()
      .populate({
        path: 'animalId',
        select: 'nombreInstitucional'
      });
    
    const fichasConNombre = fichasClinicas.map(ficha => ({
      ...ficha.toObject(),
      nombreInstitucionalAnimal: ficha.animalId ? ficha.animalId.nombreInstitucional : 'No especificado'
    }));

    res.status(200).json(fichasConNombre);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las fichas clínicas', error: error.message });
  }
};

// Obtener una ficha clínica por ID
const obtenerFichaClinicaPorId = async (req, res) => {
  try {
    const fichaClinica = await FichaClinica.findById(req.params.id);
    if (!fichaClinica) return res.status(404).json({ message: 'Ficha clínica no encontrada' });
    res.status(200).json(fichaClinica);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la ficha clínica', error: error.message });
  }
};

// Actualizar una ficha clínica
const actualizarFichaClinica = async (req, res) => {
  try {
    const fichaClinicaActualizada = await FichaClinica.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!fichaClinicaActualizada) return res.status(404).json({ message: 'Ficha clínica no encontrada' });
    res.status(200).json({ message: 'Ficha clínica actualizada exitosamente', fichaClinica: fichaClinicaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la ficha clínica', error: error.message });
  }
};

// Dar de baja una ficha clínica (cambiar estado a inactivo)
const darDeBajaFichaClinica = async (req, res) => {
  try {
    const fichaClinica = await FichaClinica.findById(req.params.id);
    if (!fichaClinica) return res.status(404).json({ message: 'Ficha clínica no encontrada' });
    fichaClinica.activo = false;
    await fichaClinica.save();
    res.status(200).json({ message: 'Ficha clínica dada de baja exitosamente', fichaClinica });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja la ficha clínica', error: error.message });
  }
};

// Dar de alta una ficha clínica (cambiar estado a activo)
const darDeAltaFichaClinica = async (req, res) => {
  try {
    const fichaClinica = await FichaClinica.findById(req.params.id);
    if (!fichaClinica) return res.status(404).json({ message: 'Ficha clínica no encontrada' });
    fichaClinica.activo = true;
    await fichaClinica.save();
    res.status(200).json({ message: 'Ficha clínica dada de alta exitosamente', fichaClinica });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta la ficha clínica', error: error.message });
  }
};

// Eliminar una ficha clínica
const eliminarFichaClinica = async (req, res) => {
  try {
    const fichaClinicaEliminada = await FichaClinica.findByIdAndDelete(req.params.id);
    if (!fichaClinicaEliminada) return res.status(404).json({ message: 'Ficha clínica no encontrada' });
    res.status(200).json({ message: 'Ficha clínica eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la ficha clínica', error: error.message });
  }
};

module.exports = { 
  crearFichaClinica, 
  obtenerFichasClinicas, 
  obtenerFichaClinicaPorId, 
  actualizarFichaClinica, 
  darDeBajaFichaClinica,  // Exportar la nueva función
  darDeAltaFichaClinica,  // Exportar la nueva función
  eliminarFichaClinica 
};
