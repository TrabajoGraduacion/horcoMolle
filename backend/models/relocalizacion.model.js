const mongoose = require('mongoose');
const { Schema } = mongoose;

const relocalizacionSchema = new Schema({
  animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  recintoAnterior: { type: mongoose.Schema.Types.ObjectId, ref: 'Recinto', required: true },
  recintoNuevo: { type: mongoose.Schema.Types.ObjectId, ref: 'Recinto', required: true },
  fechaRelocalizacion: { type: Date, required: true },
  motivo: { type: String, required: true },
  observaciones: { type: String },
  archivos: [{ type: String }],  // Para archivos adjuntos
  activo: { type: Boolean, default: true },
  realizadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' } });

const Relocalizacion = mongoose.model('Relocalizacion', relocalizacionSchema);

module.exports = Relocalizacion;
