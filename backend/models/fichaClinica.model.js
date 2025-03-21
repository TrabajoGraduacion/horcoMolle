const mongoose = require('mongoose');
const { Schema } = mongoose;

const fichaClinicaSchema = new Schema({
  animalId: { type: Schema.Types.ObjectId, ref: 'Animal' },  // Relación con el animal
  motivo: { type: String },  // Motivo como string
  
  // Relación con cada uno de los componentes de la ficha clínica
  revisionMedicaId: { type: Schema.Types.ObjectId, ref: 'RevisionMedica' }, 
  anestesiaId: { type: Schema.Types.ObjectId, ref: 'Anestesia' }, 
  metodoComplementarioId: { type: Schema.Types.ObjectId, ref: 'MetodoComplementario' },
  diagnosticoId: { type: Schema.Types.ObjectId, ref: 'Diagnostico' },
  tratamientoId: { type: Schema.Types.ObjectId, ref: 'Tratamiento' },
  evolucionId: { type: Schema.Types.ObjectId, ref: 'Evolucion' },
  odontogramaId: { type: Schema.Types.ObjectId, ref: 'Odontograma' },
  necropsiaId: { type: Schema.Types.ObjectId, ref: 'Necropsia' },
  medidasMorfologicasId: { type: Schema.Types.ObjectId, ref: 'MedidasMorfologicas' },
  
  // Observaciones generales
  observaciones: { type: String },
  
  // Información de creación y estado
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },  // Usuario que crea la ficha clínica
  activo: { type: Boolean, default: true },  // Estado de la ficha clínica (activa/inactiva)
  creadoEn: { 
    type: Date, 
    default: Date.now 
  },
  actualizadoEn: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  versionKey: false,
  timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' }
});

const FichaClinica = mongoose.model('FichaClinica', fichaClinicaSchema);
module.exports = FichaClinica;
