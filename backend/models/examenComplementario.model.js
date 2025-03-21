const mongoose = require('mongoose');
const { Schema } = mongoose;

const examenComplementarioSchema = new Schema({
  tipoExamen: {
    type: String,
    enum: ['Medicina Preventiva', 'Enfermedad']
  },
  metodo: {
    type: String
  },
  tomaMuestra: {
    type: String
  },
  realizadoPor: {
    type: String
  },
  lugarRemision: {
    nombreInstitucion: { type: String },
    direccion: { type: String },
    contacto: { type: String },
    costo: { type: Number },
    tecnicaUtilizada: { type: String }
  },
  resultados: {
    type: String
  },
  adjuntos: [String], // Array de URLs o nombres de archivos adjuntos
  observaciones: {
    type: String
  },
  activo: {
    type: Boolean,
    default: true
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
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

const ExamenComplementario = mongoose.model('ExamenComplementario', examenComplementarioSchema);

module.exports = ExamenComplementario;
