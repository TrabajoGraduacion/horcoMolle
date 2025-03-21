const Dieta = require('../models/dieta.model');
const Usuario = require('../models/usuario.model');  // Importa el modelo Usuario
const Animal = require('../models/animal.model');    // Asegúrate de importar el modelo Animal

// Crear una nueva dieta
const crearDieta = async (req, res) => {
  console.log('Iniciando creación de dieta');
  console.log('Datos recibidos:', req.body);

  try {
    console.log('Creando nueva instancia de Dieta');
    const nuevaDieta = new Dieta(req.body);
    
    console.log('Nueva dieta antes de guardar:', nuevaDieta);
    
    console.log('Guardando nueva dieta');
    await nuevaDieta.save();
    
    console.log('Dieta guardada exitosamente');
    console.log('Dieta guardada:', nuevaDieta);

    res.status(201).json({ message: 'Dieta creada exitosamente', dieta: nuevaDieta });
  } catch (error) {
    console.error('Error al crear la dieta:', error);
    console.error('Detalles del error:', error.message);
    
    if (error.name === 'ValidationError') {
      console.log('Error de validación. Campos con error:', Object.keys(error.errors));
      return res.status(400).json({ message: 'Error de validación en los datos', error: error.message });
    }

    res.status(500).json({ message: 'Error al crear la dieta', error: error.message });
  }
};

// Obtener todas las dietas
const obtenerDietas = async (req, res) => {
  try {
    const dietas = await Dieta.find()
      .populate('animalId', 'nombreInstitucional')
      .lean();

    const dietasFormateadas = dietas.map(dieta => ({
      ...dieta,
      nombreInstitucionalAnimal: dieta.animalId ? dieta.animalId.nombreInstitucional : null,
      animalId: dieta.animalId ? dieta.animalId._id : null
    }));

    res.status(200).json(dietasFormateadas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las dietas', error: error.message });
  }
};

// Obtener una dieta por ID
const obtenerDietaPorId = async (req, res) => {
  try {
    const dieta = await Dieta.findById(req.params.id)
      .populate('animalId', 'nombreInstitucional')
      .lean();

    if (!dieta) return res.status(404).json({ message: 'Dieta no encontrada' });

    const dietaFormateada = {
      ...dieta,
      nombreInstitucionalAnimal: dieta.animalId ? dieta.animalId.nombreInstitucional : null,
      animalId: dieta.animalId ? dieta.animalId._id : null
    };

    res.status(200).json(dietaFormateada);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la dieta', error: error.message });
  }
};

// Actualizar una dieta
const actualizarDieta = async (req, res) => {
  try {
    let updateData = { ...req.body };
    let unsetData = {};

    // Si animalId está vacío, lo preparamos para ser eliminado
    if (updateData.animalId === '' || updateData.animalId === null || updateData.animalId === undefined) {
      unsetData.animalId = "";
      delete updateData.animalId;
    }

    const dietaActualizada = await Dieta.findByIdAndUpdate(
      req.params.id, 
      { 
        $set: updateData,
        $unset: unsetData
      },
      { new: true, runValidators: true }
    );

    if (!dietaActualizada) {
      return res.status(404).json({ message: 'Dieta no encontrada' });
    }

    res.status(200).json({ message: 'Dieta actualizada exitosamente', dieta: dietaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la dieta', error: error.message });
  }
};

// Dar de baja una dieta (cambiar estado a inactivo)
const darDeBajaDieta = async (req, res) => {
  try {
    const dietaActualizada = await Dieta.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!dietaActualizada) return res.status(404).json({ message: 'Dieta no encontrada' });
    res.status(200).json({ message: 'Dieta dada de baja exitosamente', dieta: dietaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de baja la dieta', error: error.message });
  }
};

// Dar de alta una dieta (cambiar estado a activo)
const darDeAltaDieta = async (req, res) => {
  try {
    const dietaActualizada = await Dieta.findByIdAndUpdate(
      req.params.id,
      { activo: true },
      { new: true }
    );
    if (!dietaActualizada) return res.status(404).json({ message: 'Dieta no encontrada' });
    res.status(200).json({ message: 'Dieta dada de alta exitosamente', dieta: dietaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al dar de alta la dieta', error: error.message });
  }
};

// Eliminar una dieta
const eliminarDieta = async (req, res) => {
  try {
    const dietaEliminada = await Dieta.findByIdAndDelete(req.params.id);
    if (!dietaEliminada) return res.status(404).json({ message: 'Dieta no encontrada' });
    res.status(200).json({ message: 'Dieta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la dieta', error: error.message });
  }
};

module.exports = { 
  crearDieta, 
  obtenerDietas, 
  obtenerDietaPorId, 
  actualizarDieta, 
  darDeBajaDieta,   // Exportar la función para dar de baja
  darDeAltaDieta,   // Exportar la función para dar de alta
  eliminarDieta 
};
