const mongoose = require('mongoose');
const { Schema } = mongoose;

const modificacionRecintoSchema = new Schema({
  recintoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recinto', required: true },
  camposModificados: [
    {
      campo: { type: String, required: true },
      nuevoValor: { type: Schema.Types.Mixed, required: true }  // Usamos Mixed para aceptar cualquier tipo de dato
    }
  ],
  observaciones: { type: String },
  realizadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  activo: { type: Boolean, default: true },  // Campo activo agregado con valor por defecto true
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' } });

const ModificacionRecinto = mongoose.model('ModificacionRecinto', modificacionRecintoSchema);

module.exports = ModificacionRecinto;
