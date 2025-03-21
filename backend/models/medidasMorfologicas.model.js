const mongoose = require('mongoose');
const { Schema } = mongoose;

const medidasMorfologicasSchema = new Schema({
  fecha: { type: Date, required: true },
  longitudTotal: { type: Number },
  longitudCabeza: { type: Number },
  longitudCola: { type: Number },
  peso: { type: Number },
  circunferenciaToracica: { type: Number },
  alturaCruz: { type: Number },
  observaciones: { type: String },
  activo: { type: Boolean, default: true },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
}, { versionKey: false });

const MedidasMorfologicas = mongoose.model('MedidasMorfologicas', medidasMorfologicasSchema);

module.exports = MedidasMorfologicas;
