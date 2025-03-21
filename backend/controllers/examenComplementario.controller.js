const ExamenComplementario = require('../models/examenComplementario.model');

// Crear un nuevo examen complementario
const crearExamenComplementario = async (req, res) => {
  try {
    const nuevoExamen = new ExamenComplementario(req.body);
    await nuevoExamen.save();
    res.status(201).json({ 
      message: 'Examen complementario creado exitosamente', 
      examen: nuevoExamen,
      examenComplementarioId: nuevoExamen._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el examen complementario', error: error.message });
  }
};

// Obtener todos los exámenes complementarios
const obtenerExamenesComplementarios = async (req, res) => {
  try {
    const examenes = await ExamenComplementario.find();
    res.status(200).json(examenes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los exámenes complementarios', error: error.message });
  }
};

// Obtener un examen complementario por ID
const obtenerExamenComplementarioPorId = async (req, res) => {
  try {
    const examen = await ExamenComplementario.findById(req.params.id);
    if (!examen) return res.status(404).json({ message: 'Examen complementario no encontrado' });
    res.status(200).json(examen);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el examen complementario', error: error.message });
  }
};

// Actualizar un examen complementario
const actualizarExamenComplementario = async (req, res) => {
  try {
    const examenActualizado = await ExamenComplementario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!examenActualizado) return res.status(404).json({ message: 'Examen complementario no encontrado' });
    res.status(200).json({ message: 'Examen complementario actualizado exitosamente', examen: examenActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el examen complementario', error: error.message });
  }
};

// Dar de baja un examen complementario (cambiar estado a inactivo)
const darDeBajaExamenComplementario = async (req, res) => {
  try {
    const examen = await ExamenComplementario.findById(req.params.id);
    if (!examen) return res.status(404).json({ message: 'Examen complementario no encontrado' });
    examen.activo = false;
    await examen.save();
    res.status(200).json({ message: 'Examen complementario dado de baja exitosamente', examen });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja el examen complementario', error: error.message });
  }
};

// Dar de alta un examen complementario (cambiar estado a activo)
const darDeAltaExamenComplementario = async (req, res) => {
  try {
    const examen = await ExamenComplementario.findById(req.params.id);
    if (!examen) return res.status(404).json({ message: 'Examen complementario no encontrado' });
    examen.activo = true;
    await examen.save();
    res.status(200).json({ message: 'Examen complementario dado de alta exitosamente', examen });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta el examen complementario', error: error.message });
  }
};

// Eliminar un examen complementario
const eliminarExamenComplementario = async (req, res) => {
  try {
    const examenEliminado = await ExamenComplementario.findByIdAndDelete(req.params.id);
    if (!examenEliminado) return res.status(404).json({ message: 'Examen complementario no encontrado' });
    res.status(200).json({ message: 'Examen complementario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el examen complementario', error: error.message });
  }
};

module.exports = {
  crearExamenComplementario,
  obtenerExamenesComplementarios,
  obtenerExamenComplementarioPorId,
  actualizarExamenComplementario,
  darDeBajaExamenComplementario,  // Exportar la nueva función
  darDeAltaExamenComplementario,  // Exportar la nueva función
  eliminarExamenComplementario,
};
