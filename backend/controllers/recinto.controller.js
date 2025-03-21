const Recinto = require('../models/recinto.model');
const ModificacionRecinto = require('../models/modificacionRecinto.model');

const crearRecinto = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.ubicacion || !req.body.especie) {
      return res.status(400).json({ message: 'Faltan campos requeridos: nombre, ubicación o especie' });
    }

    const recinto = new Recinto(req.body);
    await recinto.save();
    res.status(201).json(recinto);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Error de validación en los datos: ' + error.message });
    }
    res.status(500).json({ message: 'Error interno del servidor: ' + error.message });
  }
};

const obtenerRecintos = async (req, res) => {
  try {
    const recintos = await Recinto.find();
    res.status(200).json(recintos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerRecintoPorId = async (req, res) => {
  try {
    const recinto = await Recinto.findById(req.params.id);
    if (!recinto) return res.status(404).json({ message: "Recinto no encontrado" });
    res.status(200).json(recinto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function registrarModificacionesGenerales(campo, valorActual, nuevoValor, modificaciones) {
  // Comparar fechas normalizando formato
  if (campo.includes('fecha') && valorActual && nuevoValor) {
    const fechaActual = new Date(valorActual).toISOString().split('T')[0];
    const nuevaFecha = new Date(nuevoValor).toISOString().split('T')[0];
    if (fechaActual !== nuevaFecha) {
      modificaciones.push({
        campo: campo,
        nuevoValor: nuevoValor
      });
    }
  } 
  // Comparar arrays
  else if (Array.isArray(valorActual) && Array.isArray(nuevoValor)) {
    if (!compararArrays(valorActual, nuevoValor)) {
      modificaciones.push({
        campo: campo,
        nuevoValor: nuevoValor
      });
    }
  } 
  // Comparar objetos complejos
  else if (typeof valorActual === 'object' && typeof nuevoValor === 'object') {
    if (JSON.stringify(valorActual) !== JSON.stringify(nuevoValor)) {
      modificaciones.push({
        campo: campo,
        nuevoValor: nuevoValor
      });
    }
  } 
  // Comparar valores simples
  else if (valorActual !== nuevoValor) {
    modificaciones.push({
      campo: campo,
      nuevoValor: nuevoValor
    });
  }
}

function compararArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (typeof arr1[i] === 'object' && typeof arr2[i] === 'object') {
      if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) return false;
    } else if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

const compararAmbientes = (tipoAmbiente, ambientesActuales, ambientesNuevos, modificaciones) => {
  // Si la cantidad de ambientes cambia, registramos cada nuevo ambiente uno por uno
  if (ambientesNuevos.length > ambientesActuales.length) {
    for (let i = 0; i < ambientesNuevos.length; i++) {
      const nuevo = ambientesNuevos[i];
      const actual = ambientesActuales[i] || {}; // Si no existe en los actuales, es un nuevo ambiente

      if (!actual.nombre) {
        modificaciones.push({ campo: `${tipoAmbiente}[${i}].nombre`, nuevoValor: nuevo.nombre });
      }

      // Registrar campos de observaciones, dimensiones, estructura y ambientación para el nuevo ambiente
      if (!actual.observaciones) {
        modificaciones.push({ campo: `${tipoAmbiente}[${i}].observaciones`, nuevoValor: nuevo.observaciones });
      }

      const camposDimensiones = ['largo', 'ancho', 'alto', 'area'];
      camposDimensiones.forEach(campo => {
        if (nuevo.dimensiones && nuevo.dimensiones[campo]) {
          modificaciones.push({ campo: `${tipoAmbiente}[${i}].dimensiones.${campo}`, nuevoValor: nuevo.dimensiones[campo] });
        }
      });

      const camposEstructura = ['coberturaLateral', 'sosten', 'coberturaSuperior', 'mangasJaulasManejo'];
      camposEstructura.forEach(campo => {
        if (nuevo.estructura && nuevo.estructura[campo]) {
          modificaciones.push({ campo: `${tipoAmbiente}[${i}].estructura.${campo}`, nuevoValor: nuevo.estructura[campo] });
        }
      });

      const camposAmbientacion = ['comederosBebederos', 'refugios', 'vegetacion', 'clima'];
      camposAmbientacion.forEach(campo => {
        if (nuevo.ambientacion && nuevo.ambientacion[campo]) {
          modificaciones.push({ campo: `${tipoAmbiente}[${i}].ambientacion.${campo}`, nuevoValor: nuevo.ambientacion[campo] });
        }
      });
    }
  }

  // Ahora, comparar ambientes existentes
  for (let i = 0; i < ambientesActuales.length; i++) {
    const actual = ambientesActuales[i];
    const nuevo = ambientesNuevos[i];

    if (!nuevo) continue; // Si no hay un nuevo ambiente, lo saltamos

    // Comparar nombre
    if (actual.nombre !== nuevo.nombre) {
      modificaciones.push({ campo: `${tipoAmbiente}[${i}].nombre`, nuevoValor: nuevo.nombre });
    }

    // Comparar observaciones
    if (actual.observaciones !== nuevo.observaciones) {
      modificaciones.push({ campo: `${tipoAmbiente}[${i}].observaciones`, nuevoValor: nuevo.observaciones });
    }

    // Comparar dimensiones
    const camposDimensiones = ['largo', 'ancho', 'alto', 'area'];
    camposDimensiones.forEach(campo => {
      if (actual.dimensiones && nuevo.dimensiones && actual.dimensiones[campo] !== nuevo.dimensiones[campo]) {
        modificaciones.push({ campo: `${tipoAmbiente}[${i}].dimensiones.${campo}`, nuevoValor: nuevo.dimensiones[campo] });
      }
    });

    // Comparar estructura
    const camposEstructura = ['coberturaLateral', 'sosten', 'coberturaSuperior', 'mangasJaulasManejo'];
    camposEstructura.forEach(campo => {
      if (actual.estructura && nuevo.estructura && actual.estructura[campo] !== nuevo.estructura[campo]) {
        modificaciones.push({ campo: `${tipoAmbiente}[${i}].estructura.${campo}`, nuevoValor: nuevo.estructura[campo] });
      }
    });

    // Comparar ambientacion
    const camposAmbientacion = ['comederosBebederos', 'refugios', 'vegetacion', 'clima'];
    camposAmbientacion.forEach(campo => {
      if (actual.ambientacion && nuevo.ambientacion && actual.ambientacion[campo] !== nuevo.ambientacion[campo]) {
        modificaciones.push({ campo: `${tipoAmbiente}[${i}].ambientacion.${campo}`, nuevoValor: nuevo.ambientacion[campo] });
      }
    });
  }
};

function compararDimensionesGenerales(valorActual, nuevoValor, modificaciones) {
  const camposDimensiones = ['largo', 'ancho', 'alto', 'area'];

  // Comparar los campos de nivel superior
  camposDimensiones.forEach((campo) => {
    if (valorActual[campo] !== nuevoValor[campo]) {
      modificaciones.push({
        campo: `dimensionesGenerales.${campo}`,
        nuevoValor: nuevoValor[campo]
      });
    }
  });

  // Comparar alaIzquierda
  camposDimensiones.forEach((campo) => {
    if (valorActual.alaIzquierda && nuevoValor.alaIzquierda) {
      if (valorActual.alaIzquierda[campo] !== nuevoValor.alaIzquierda[campo]) {
        modificaciones.push({
          campo: `dimensionesGenerales.alaIzquierda.${campo}`,
          nuevoValor: nuevoValor.alaIzquierda[campo]
        });
      }
    }
  });

  // Comparar alaDerecha
  camposDimensiones.forEach((campo) => {
    if (valorActual.alaDerecha && nuevoValor.alaDerecha) {
      if (valorActual.alaDerecha[campo] !== nuevoValor.alaDerecha[campo]) {
        modificaciones.push({
          campo: `dimensionesGenerales.alaDerecha.${campo}`,
          nuevoValor: nuevoValor.alaDerecha[campo]
        });
      }
    }
  });
}

const actualizarRecinto = async (req, res) => {
  try {
    const recintoActual = await Recinto.findById(req.params.id);

    if (!recintoActual) {
      return res.status(404).json({ message: "Recinto no encontrado" });
    }

    const recintoActualizado = await Recinto.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!recintoActualizado) {
      return res.status(404).json({ message: "Recinto no encontrado" });
    }

    const modificaciones = [];

    // Comparar los campos generales usando la función registrarModificacionesGenerales
    registrarModificacionesGenerales('nombre', recintoActual.nombre, req.body.nombre, modificaciones);
    registrarModificacionesGenerales('fechaInstalacion', recintoActual.fechaInstalacion, req.body.fechaInstalacion, modificaciones);
    registrarModificacionesGenerales('codigo', recintoActual.codigo, req.body.codigo, modificaciones);
    registrarModificacionesGenerales('ubicacion', recintoActual.ubicacion, req.body.ubicacion, modificaciones);
    registrarModificacionesGenerales('especie', recintoActual.especie, req.body.especie, modificaciones);
    registrarModificacionesGenerales('numeroIndividuosRecomendados', recintoActual.numeroIndividuosRecomendados, req.body.numeroIndividuosRecomendados, modificaciones);
    registrarModificacionesGenerales('descripcionRecinto', recintoActual.descripcionRecinto, req.body.descripcionRecinto, modificaciones);
    registrarModificacionesGenerales('condicionesAmbientales', recintoActual.condicionesAmbientales, req.body.condicionesAmbientales, modificaciones);
    registrarModificacionesGenerales('condicionesBioseguridad', recintoActual.condicionesBioseguridad, req.body.condicionesBioseguridad, modificaciones);
    registrarModificacionesGenerales('calidadDidactica', recintoActual.calidadDidactica, req.body.calidadDidactica, modificaciones);

    compararDimensionesGenerales(recintoActual.dimensionesGenerales, req.body.dimensionesGenerales, modificaciones);
    registrarModificacionesGenerales('fotos', recintoActual.fotos, req.body.fotos, modificaciones);
    compararAmbientes('ambientesExternos', recintoActual.ambientesExternos, req.body.ambientesExternos, modificaciones);
    compararAmbientes('ambientesInternos', recintoActual.ambientesInternos, req.body.ambientesInternos, modificaciones);

    if (modificaciones.length > 0) {
      await ModificacionRecinto.create({
        recintoId: recintoActualizado._id,
        camposModificados: modificaciones,
      });
    }

    res.status(200).json(recintoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const darDeBajaRecinto = async (req, res) => {
  try {
    const recinto = await Recinto.findById(req.params.id);
    if (!recinto) return res.status(404).json({ message: "Recinto no encontrado" });
    recinto.activo = false;
    await recinto.save();
    res.status(200).json({ message: "Recinto dado de baja exitosamente", recinto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const darDeAltaRecinto = async (req, res) => {
  try {
    const recinto = await Recinto.findById(req.params.id);
    if (!recinto) return res.status(404).json({ message: "Recinto no encontrado" });
    recinto.activo = true;
    await recinto.save();
    res.status(200).json({ message: "Recinto dado de alta exitosamente", recinto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const eliminarRecinto = async (req, res) => {
  try {
    const recintoEliminado = await Recinto.findByIdAndDelete(req.params.id);
    if (!recintoEliminado) return res.status(404).json({ message: "Recinto no encontrado" });
    res.status(200).json({ message: "Recinto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  crearRecinto, 
  obtenerRecintos, 
  obtenerRecintoPorId, 
  actualizarRecinto, 
  darDeBajaRecinto,
  darDeAltaRecinto,
  eliminarRecinto 
};