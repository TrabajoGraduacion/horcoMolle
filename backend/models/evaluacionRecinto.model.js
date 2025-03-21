const mongoose = require('mongoose');
const { Schema } = mongoose;

const evaluacionRecintoSchema = new Schema({
  recintoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recinto', required: true },
  fechaEvaluacion: { type: Date, required: true },
  descripcion: { type: String, required: true },
  condicionesAmbientales: { type: String },
  condicionesBioseguridad: { type: String },
  calidadDidactica: { type: String },
  observaciones: { type: String },
  fotografias: [{ type: String }],  // Para fotos o archivos adjuntos
  realizadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  activo: { type: Boolean, default: true },  // Se agrega el campo activo
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' } });

const EvaluacionRecinto = mongoose.model('EvaluacionRecinto', evaluacionRecintoSchema);

module.exports = EvaluacionRecinto;
