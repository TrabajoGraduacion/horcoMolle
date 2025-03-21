const Animal = require('../models/animal.model');

// Crear un nuevo animal
const crearAnimal = async (req, res) => {
  try {
    // console.log('Datos recibidos para crear el animal:', req.body); // Debug: Mostrar datos recibidos

    const animal = new Animal(req.body);
    await animal.save();
    
    // console.log('Animal creado exitosamente:', animal); // Debug: Mostrar el animal creado

    res.status(201).json(animal);
  } catch (error) {
    console.error('Error al crear el animal:', error); // Debug: Mostrar el error
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los animales
const obtenerAnimales = async (req, res) => {
  try {
    const animales = await Animal.find();  // Traerá todos los animales sin filtro ni populate
    res.status(200).json(animales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un animal por ID
const obtenerAnimalPorId = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);  // No usa populate
    if (!animal) return res.status(404).json({ message: "Animal no encontrado" });
    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un animal
const actualizarAnimal = async (req, res) => {
  try {
    const animalActualizado = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });  // No usa populate
    if (!animalActualizado) return res.status(404).json({ message: "Animal no encontrado" });
    res.status(200).json(animalActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dar de baja un animal (cambiar estado a inactivo)
const darDeBajaAnimal = async (req, res) => {
  try {
    const animalActualizado = await Animal.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!animalActualizado) return res.status(404).json({ message: "Animal no encontrado" });
    res.status(200).json({ message: "Animal dado de baja exitosamente", animal: animalActualizado });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dar de alta un animal (cambiar estado a activo)
const darDeAltaAnimal = async (req, res) => {
  try {
    const animalActualizado = await Animal.findByIdAndUpdate(
      req.params.id,
      { activo: true },
      { new: true }
    );
    if (!animalActualizado) return res.status(404).json({ message: "Animal no encontrado" });
    res.status(200).json({ message: "Animal dado de alta exitosamente", animal: animalActualizado });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un animal
const eliminarAnimal = async (req, res) => {
  try {
    const animalEliminado = await Animal.findByIdAndDelete(req.params.id);  // No usa populate
    if (!animalEliminado) return res.status(404).json({ message: "Animal no encontrado" });
    res.status(200).json({ message: "Animal eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  crearAnimal, 
  obtenerAnimales, 
  obtenerAnimalPorId, 
  actualizarAnimal, 
  darDeBajaAnimal,  // Exportar la función de dar de baja
  darDeAltaAnimal,  // Exportar la función de dar de alta
  eliminarAnimal 
};
