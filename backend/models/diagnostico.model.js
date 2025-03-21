const mongoose = require('mongoose');
const { Schema } = mongoose;

const diagnosticoSchema = new Schema({
  fecha: { type: Date },
  tipoDiagnostico: { type: String },
  diagnosticoPrincipal: { type: String },
  diagnosticosSecundarios: { type: String },
  recomendaciones: { type: String },
  adjuntos: { type: [String] }, // Almacena URLs de archivos adjuntos
  activo: { type: Boolean, default: true },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  creadoEn: { type: Date, default: Date.now },
  modificadoEn: { type: Date, default: Date.now }
}, { versionKey: false });

const Diagnostico = mongoose.model('Diagnostico', diagnosticoSchema);

module.exports = Diagnostico;
