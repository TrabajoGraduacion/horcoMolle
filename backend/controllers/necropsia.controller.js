const Necropsia = require("../models/necropsia.model");

// Crear una nueva necropsia
const crearNecropsia = async (req, res) => {
  try {
    const nuevaNecropsia = new Necropsia(req.body);
    await nuevaNecropsia.save();
    res.status(201).json({ 
      message: "Necropsia creada exitosamente", 
      necropsia: nuevaNecropsia,
      necropsiaId: nuevaNecropsia._id
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la necropsia", error: error.message });
  }
};

// Obtener todas las necropsias
const obtenerNecropsias = async (req, res) => {
  try {
    const necropsias = await Necropsia.find();
    res.status(200).json(necropsias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las necropsias", error: error.message });
  }
};

// Obtener una necropsia por ID
const obtenerNecropsiaPorId = async (req, res) => {
  try {
    const necropsia = await Necropsia.findById(req.params.id);
    if (!necropsia) return res.status(404).json({ message: "Necropsia no encontrada" });
    res.status(200).json(necropsia);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la necropsia", error: error.message });
  }
};

// Actualizar una necropsia
const actualizarNecropsia = async (req, res) => {
  try {
    const necropsiaActualizada = await Necropsia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!necropsiaActualizada) return res.status(404).json({ message: "Necropsia no encontrada" });
    res.status(200).json({ message: "Necropsia actualizada exitosamente", necropsia: necropsiaActualizada });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la necropsia", error: error.message });
  }
};

// Dar de baja una necropsia (cambiar estado a inactivo)
const darDeBajaNecropsia = async (req, res) => {
  try {
    const necropsia = await Necropsia.findById(req.params.id);
    if (!necropsia) return res.status(404).json({ message: "Necropsia no encontrada" });
    necropsia.activo = false;
    await necropsia.save();
    res.status(200).json({ message: "Necropsia dada de baja exitosamente", necropsia });
  } catch (error) {
    res.status(500).json({ message: "Error al dar de baja la necropsia", error: error.message });
  }
};

// Dar de alta una necropsia (cambiar estado a activo)
const darDeAltaNecropsia = async (req, res) => {
  try {
    const necropsia = await Necropsia.findById(req.params.id);
    if (!necropsia) return res.status(404).json({ message: "Necropsia no encontrada" });
    necropsia.activo = true;
    await necropsia.save();
    res.status(200).json({ message: "Necropsia dada de alta exitosamente", necropsia });
  } catch (error) {
    res.status(500).json({ message: "Error al dar de alta la necropsia", error: error.message });
  }
};

// Eliminar una necropsia
const eliminarNecropsia = async (req, res) => {
  try {
    const necropsiaEliminada = await Necropsia.findByIdAndDelete(req.params.id);
    if (!necropsiaEliminada) return res.status(404).json({ message: "Necropsia no encontrada" });
    res.status(200).json({ message: "Necropsia eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la necropsia", error: error.message });
  }
};

module.exports = { 
  crearNecropsia, 
  obtenerNecropsias, 
  obtenerNecropsiaPorId, 
  actualizarNecropsia, 
  darDeBajaNecropsia,    // Exportar la nueva función
  darDeAltaNecropsia,    // Exportar la nueva función
  eliminarNecropsia 
};
