const mongoose = require('mongoose');
const { Schema } = mongoose;

// Esquema para Dieta
const dietaSchema = new Schema({
  especie: { 
    type: String, 
  },
  animalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Animal', 
  }, // Se puede cargar por especie o por ID de animal específico
  fechaInicio: { 
    type: Date, 
  }, // Fecha de inicio de ofrecimiento de la dieta
  estacion: { 
    type: String, 
    enum: ['Verano', 'Otoño', 'Invierno', 'Primavera'], 
  }, // Estación del año
  kcalRequeridasSP: { 
    type: Number, 
  }, // Kilocalorías requeridas por especie
  kcalDieta: { 
    type: Number, 
  }, // Kilocalorías totales de la dieta
  observaciones: { 
    type: String 
  }, // Observaciones adicionales
  formulacionDieta: { 
    type: String 
  }, // Campo para adjuntar archivo con la descripción "FORMULACIÓN DE DIETA"
  activo: { 
    type: Boolean, 
    default: true 
  },
  creadoPor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  creadoEn: { 
    type: Date, 
    default: Date.now 
  },
  actualizadoEn: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' } });

const Dieta = mongoose.model('Dieta', dietaSchema);

module.exports = Dieta;
