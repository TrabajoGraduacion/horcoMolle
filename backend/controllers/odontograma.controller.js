const Odontograma = require('../models/odontograma.model');

// Crear un nuevo odontograma
const crearOdontograma = async (req, res) => {
  try {
    const nuevoOdontograma = new Odontograma(req.body);
    await nuevoOdontograma.save();
    res.status(201).json({ 
      message: 'Odontograma creado exitosamente', 
      odontograma: nuevoOdontograma,
      odontogramaId: nuevoOdontograma._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el odontograma', error: error.message });
  }
};

// Obtener todos los odontogramas
const obtenerOdontogramas = async (req, res) => {
  try {
    const odontogramas = await Odontograma.find();
    res.status(200).json(odontogramas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los odontogramas', error: error.message });
  }
};

// Obtener un odontograma por ID
const obtenerOdontogramaPorId = async (req, res) => {
  try {
    const odontograma = await Odontograma.findById(req.params.id);
    if (!odontograma) return res.status(404).json({ message: 'Odontograma no encontrado' });
    res.status(200).json(odontograma);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el odontograma', error: error.message });
  }
};

// Actualizar un odontograma
const actualizarOdontograma = async (req, res) => {
  try {
    const odontogramaActualizado = await Odontograma.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!odontogramaActualizado) return res.status(404).json({ message: 'Odontograma no encontrado' });
    res.status(200).json({ message: 'Odontograma actualizado exitosamente', odontograma: odontogramaActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el odontograma', error: error.message });
  }
};

// Dar de baja un odontograma (cambiar estado a inactivo)
const darDeBajaOdontograma = async (req, res) => {
  try {
    const odontograma = await Odontograma.findById(req.params.id);
    if (!odontograma) return res.status(404).json({ message: 'Odontograma no encontrado' });
    odontograma.activo = false;
    await odontograma.save();
    res.status(200).json({ message: 'Odontograma dado de baja exitosamente', odontograma });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja el odontograma', error: error.message });
  }
};

// Dar de alta un odontograma (cambiar estado a activo)
const darDeAltaOdontograma = async (req, res) => {
  try {
    const odontograma = await Odontograma.findById(req.params.id);
    if (!odontograma) return res.status(404).json({ message: 'Odontograma no encontrado' });
    odontograma.activo = true;
    await odontograma.save();
    res.status(200).json({ message: 'Odontograma dado de alta exitosamente', odontograma });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta el odontograma', error: error.message });
  }
};

// Eliminar un odontograma
const eliminarOdontograma = async (req, res) => {
  try {
    const odontogramaEliminado = await Odontograma.findByIdAndDelete(req.params.id);
    if (!odontogramaEliminado) return res.status(404).json({ message: 'Odontograma no encontrado' });
    res.status(200).json({ message: 'Odontograma eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el odontograma', error: error.message });
  }
};

module.exports = {
  crearOdontograma,
  obtenerOdontogramas,
  obtenerOdontogramaPorId,
  actualizarOdontograma,
  darDeBajaOdontograma, // Exportar la nueva función
  darDeAltaOdontograma, // Exportar la nueva función
  eliminarOdontograma
};
