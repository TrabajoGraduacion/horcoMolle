const mongoose = require('mongoose');
const { Schema } = mongoose;

const evolucionSchema = new Schema({
  fecha: { type: Date },
  estadoGeneral: { type: String, enum: ['Bueno', 'Regular', 'Malo'] },
  cambiosCondicion: { type: String },
  activo: { type: Boolean, default: true },
  responsable: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
}, { versionKey: false });

const Evolucion = mongoose.model('Evolucion', evolucionSchema);

module.exports = Evolucion;
