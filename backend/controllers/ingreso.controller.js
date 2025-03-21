const Ingreso = require('../models/ingreso.model');

// Crear un nuevo ingreso
const crearIngreso = async (req, res) => {
  try {
    // console.log("Inicio de la creación del ingreso.");

    // Imprimir el cuerpo de la solicitud
    // console.log("Datos recibidos para el ingreso:", req.body);

    const nuevoIngreso = new Ingreso(req.body);
    // console.log("Ingreso creado:", nuevoIngreso);

    await nuevoIngreso.save();
    // console.log("Ingreso guardado en la base de datos.");

    res.status(201).json({ message: 'Ingreso creado exitosamente', ingreso: nuevoIngreso });
  } catch (error) {
    // console.error("Error al crear el ingreso:", error);
    res.status(500).json({ message: 'Error al crear el ingreso', error: error.message });
  }
};


// Obtener todos los ingresos
const obtenerIngresos = async (req, res) => {
  try {
    const ingresos = await Ingreso.find(); // Sin populate, solo devuelve los IDs de las referencias
    res.status(200).json(ingresos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los ingresos', error: error.message });
  }
};

// Obtener un ingreso por ID
const obtenerIngresoPorId = async (req, res) => {
  try {
    const ingreso = await Ingreso.findById(req.params.id); // Sin populate
    if (!ingreso) return res.status(404).json({ message: 'Ingreso no encontrado' });
    res.status(200).json(ingreso);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el ingreso', error: error.message });
  }
};

// Actualizar un ingreso
const actualizarIngreso = async (req, res) => {
  try {
    const ingresoActualizado = await Ingreso.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Sin populate
    if (!ingresoActualizado) return res.status(404).json({ message: 'Ingreso no encontrado' });
    res.status(200).json({ message: 'Ingreso actualizado exitosamente', ingreso: ingresoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el ingreso', error: error.message });
  }
};

// Dar de baja un ingreso (cambiar estado a inactivo)
const darDeBajaIngreso = async (req, res) => {
  try {
    const ingreso = await Ingreso.findById(req.params.id);
    if (!ingreso) return res.status(404).json({ message: 'Ingreso no encontrado' });
    ingreso.activo = false;
    await ingreso.save();
    res.status(200).json({ message: 'Ingreso dado de baja exitosamente', ingreso });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja el ingreso', error: error.message });
  }
};

// Dar de alta un ingreso (cambiar estado a activo)
const darDeAltaIngreso = async (req, res) => {
  try {
    const ingreso = await Ingreso.findById(req.params.id);
    if (!ingreso) return res.status(404).json({ message: 'Ingreso no encontrado' });
    ingreso.activo = true;
    await ingreso.save();
    res.status(200).json({ message: 'Ingreso dado de alta exitosamente', ingreso });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta el ingreso', error: error.message });
  }
};

// Eliminar un ingreso
const eliminarIngreso = async (req, res) => {
  try {
    const ingresoEliminado = await Ingreso.findByIdAndDelete(req.params.id);
    if (!ingresoEliminado) return res.status(404).json({ message: 'Ingreso no encontrado' });
    res.status(200).json({ message: 'Ingreso eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el ingreso', error: error.message });
  }
};

module.exports = { 
  crearIngreso, 
  obtenerIngresos, 
  obtenerIngresoPorId, 
  actualizarIngreso, 
  darDeBajaIngreso,  // Exportar la nueva función
  darDeAltaIngreso,  // Exportar la nueva función
  eliminarIngreso 
};
