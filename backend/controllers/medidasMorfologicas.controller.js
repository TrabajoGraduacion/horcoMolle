const MedidasMorfologicas = require('../models/medidasMorfologicas.model');

const crearMedidasMorfologicas = async (req, res) => {
  try {
    const nuevaMedidasMorfologicas = new MedidasMorfologicas(req.body);
    await nuevaMedidasMorfologicas.save();
    res.status(201).json({ 
      message: 'Medidas morfológicas creadas exitosamente', 
      medidasMorfologicas: nuevaMedidasMorfologicas,
      medidasMorfologicasId: nuevaMedidasMorfologicas._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear las medidas morfológicas', error: error.message });
  }
};

const obtenerMedidasMorfologicas = async (req, res) => {
  try {
    const medidasMorfologicas = await MedidasMorfologicas.find();
    res.status(200).json(medidasMorfologicas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las medidas morfológicas', error: error.message });
  }
};

const obtenerMedidasMorfologicasPorId = async (req, res) => {
  try {
    const medidasMorfologicas = await MedidasMorfologicas.findById(req.params.id);
    if (!medidasMorfologicas) return res.status(404).json({ message: 'Medidas morfológicas no encontradas' });
    res.status(200).json(medidasMorfologicas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las medidas morfológicas', error: error.message });
  }
};

const actualizarMedidasMorfologicas = async (req, res) => {
  try {
    const medidasMorfologicasActualizadas = await MedidasMorfologicas.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medidasMorfologicasActualizadas) return res.status(404).json({ message: 'Medidas morfológicas no encontradas' });
    res.status(200).json({ message: 'Medidas morfológicas actualizadas exitosamente', medidasMorfologicas: medidasMorfologicasActualizadas });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar las medidas morfológicas', error: error.message });
  }
};

// Dar de baja una medida morfológica (cambiar estado a inactivo)
const darDeBajaMedidasMorfologicas = async (req, res) => {
  try {
    const medidasMorfologicas = await MedidasMorfologicas.findById(req.params.id);
    if (!medidasMorfologicas) return res.status(404).json({ message: 'Medidas morfológicas no encontradas' });
    medidasMorfologicas.activo = false;
    await medidasMorfologicas.save();
    res.status(200).json({ message: 'Medidas morfológicas dadas de baja exitosamente', medidasMorfologicas });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja las medidas morfológicas', error: error.message });
  }
};

// Dar de alta una medida morfológica (cambiar estado a activo)
const darDeAltaMedidasMorfologicas = async (req, res) => {
  try {
    const medidasMorfologicas = await MedidasMorfologicas.findById(req.params.id);
    if (!medidasMorfologicas) return res.status(404).json({ message: 'Medidas morfológicas no encontradas' });
    medidasMorfologicas.activo = true;
    await medidasMorfologicas.save();
    res.status(200).json({ message: 'Medidas morfológicas dadas de alta exitosamente', medidasMorfologicas });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta las medidas morfológicas', error: error.message });
  }
};

const eliminarMedidasMorfologicas = async (req, res) => {
  try {
    const medidasMorfologicasEliminadas = await MedidasMorfologicas.findByIdAndDelete(req.params.id);
    if (!medidasMorfologicasEliminadas) return res.status(404).json({ message: 'Medidas morfológicas no encontradas' });
    res.status(200).json({ message: 'Medidas morfológicas eliminadas exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar las medidas morfológicas', error: error.message });
  }
};

module.exports = { 
  crearMedidasMorfologicas, 
  obtenerMedidasMorfologicas, 
  obtenerMedidasMorfologicasPorId, 
  actualizarMedidasMorfologicas, 
  darDeBajaMedidasMorfologicas,  // Exportar la nueva función
  darDeAltaMedidasMorfologicas,  // Exportar la nueva función
  eliminarMedidasMorfologicas 
};
