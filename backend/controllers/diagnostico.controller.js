const Diagnostico = require("../models/diagnostico.model");

// Crear un nuevo diagnóstico
const crearDiagnostico = async (req, res) => {
  try {
    const nuevoDiagnostico = new Diagnostico(req.body);
    await nuevoDiagnostico.save();
    res.status(201).json({
      message: "Diagnóstico creado exitosamente",
      diagnostico: nuevoDiagnostico,
      diagnosticoId: nuevoDiagnostico._id
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el diagnóstico",
      error: error.message,
    });
  }
};

// Obtener todos los diagnósticos
const obtenerDiagnosticos = async (req, res) => {
  try {
    const diagnosticos = await Diagnostico.find();
    res.status(200).json(diagnosticos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los diagnósticos",
      error: error.message,
    });
  }
};

// Obtener un diagnóstico por ID
const obtenerDiagnosticoPorId = async (req, res) => {
  try {
    const diagnostico = await Diagnostico.findById(req.params.id);
    if (!diagnostico)
      return res.status(404).json({ message: "Diagnóstico no encontrado" });
    res.status(200).json(diagnostico);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el diagnóstico",
      error: error.message,
    });
  }
};

// Actualizar un diagnóstico
const actualizarDiagnostico = async (req, res) => {
  try {
    const diagnosticoActualizado = await Diagnostico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!diagnosticoActualizado)
      return res
        .status(404)
        .json({ message: "Diagnóstico no encontrado" });
    res.status(200).json({
      message: "Diagnóstico actualizado exitosamente",
      diagnostico: diagnosticoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el diagnóstico",
      error: error.message,
    });
  }
};

// Dar de baja un diagnóstico
const darDeBajaDiagnostico = async (req, res) => {
  try {
    const diagnosticoBaja = await Diagnostico.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!diagnosticoBaja)
      return res.status(404).json({ message: "Diagnóstico no encontrado" });
    res.status(200).json({
      message: "Diagnóstico dado de baja con éxito",
      diagnostico: diagnosticoBaja,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al dar de baja el diagnóstico",
      error: error.message,
    });
  }
};

// Dar de alta un diagnóstico
const darDeAltaDiagnostico = async (req, res) => {
  try {
    const diagnosticoAlta = await Diagnostico.findByIdAndUpdate(
      req.params.id,
      { activo: true },
      { new: true }
    );
    if (!diagnosticoAlta)
      return res.status(404).json({ message: "Diagnóstico no encontrado" });
    res.status(200).json({
      message: "Diagnóstico dado de alta con éxito",
      diagnostico: diagnosticoAlta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al dar de alta el diagnóstico",
      error: error.message,
    });
  }
};

// Eliminar un diagnóstico
const eliminarDiagnostico = async (req, res) => {
  try {
    const diagnosticoEliminado = await Diagnostico.findByIdAndDelete(
      req.params.id
    );
    if (!diagnosticoEliminado)
      return res.status(404).json({ message: "Diagnóstico no encontrado" });
    res.status(200).json({ message: "Diagnóstico eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el diagnóstico",
      error: error.message,
    });
  }
};

module.exports = {
  crearDiagnostico,
  obtenerDiagnosticos,
  obtenerDiagnosticoPorId,
  actualizarDiagnostico,
  darDeBajaDiagnostico,
  darDeAltaDiagnostico,
  eliminarDiagnostico,
};
