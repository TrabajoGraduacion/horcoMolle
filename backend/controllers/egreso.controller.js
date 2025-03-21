const Egreso = require('../models/egreso.model');

// Crear un nuevo egreso
const crearEgreso = async (req, res) => {
  try {
    const nuevoEgreso = new Egreso(req.body);
    await nuevoEgreso.save();
    res.status(201).json({ message: 'Egreso creado exitosamente', egreso: nuevoEgreso });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el egreso', error: error.message });
  }
};

// Obtener todos los egresos
const obtenerEgresos = async (req, res) => {
  try {
    const egresos = await Egreso.find()
      .populate('animalId', 'nombreInstitucional')
      .lean();

    const egresosFormateados = egresos.map(egreso => ({
      ...egreso,
      nombreInstitucionalAnimal: egreso.animalId ? egreso.animalId.nombreInstitucional : null,
      animalId: egreso.animalId ? egreso.animalId._id : null
    }));

    res.status(200).json(egresosFormateados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los egresos', error: error.message });
  }
};

// Obtener un egreso por ID
const obtenerEgresoPorId = async (req, res) => {
  try {
    const egreso = await Egreso.findById(req.params.id)
      .populate('animalId', 'nombreInstitucional')
      .lean();

    if (!egreso) return res.status(404).json({ message: 'Egreso no encontrado' });

    const egresoFormateado = {
      ...egreso,
      nombreInstitucionalAnimal: egreso.animalId ? egreso.animalId.nombreInstitucional : null,
      animalId: egreso.animalId ? egreso.animalId._id : null
    };

    res.status(200).json(egresoFormateado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el egreso', error: error.message });
  }
};

// Actualizar un egreso
const actualizarEgreso = async (req, res) => {
  try {
    const egresoActualizado = await Egreso.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!egresoActualizado) return res.status(404).json({ message: 'Egreso no encontrado' });
    res.status(200).json({ message: 'Egreso actualizado exitosamente', egreso: egresoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el egreso', error: error.message });
  }
};

// Dar de baja un egreso
const darDeBajaEgreso = async (req, res) => {
  try {
    const egreso = await Egreso.findById(req.params.id);
    if (!egreso) return res.status(404).json({ message: 'Egreso no encontrado' });
    egreso.activo = false;
    await egreso.save();
    res.status(200).json({ message: 'Egreso dado de baja exitosamente', egreso });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja el egreso', error: error.message });
  }
};

// Dar de alta un egreso
const darDeAltaEgreso = async (req, res) => {
  try {
    const egreso = await Egreso.findById(req.params.id);
    if (!egreso) return res.status(404).json({ message: 'Egreso no encontrado' });
    egreso.activo = true;
    await egreso.save();
    res.status(200).json({ message: 'Egreso dado de alta exitosamente', egreso });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta el egreso', error: error.message });
  }
};

// Eliminar un egreso
const eliminarEgreso = async (req, res) => {
  try {
    const egresoEliminado = await Egreso.findByIdAndDelete(req.params.id);
    if (!egresoEliminado) return res.status(404).json({ message: 'Egreso no encontrado' });
    res.status(200).json({ message: 'Egreso eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el egreso', error: error.message });
  }
};

module.exports = { 
  crearEgreso, 
  obtenerEgresos, 
  obtenerEgresoPorId, 
  actualizarEgreso, 
  darDeBajaEgreso, 
  darDeAltaEgreso, 
  eliminarEgreso 
};
