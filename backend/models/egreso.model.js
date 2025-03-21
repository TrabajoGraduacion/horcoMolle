const mongoose = require('mongoose');
const { Schema } = mongoose;

const egresoSchema = new Schema({
  animalId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Animal', 
    required: true  // Agregado para relacionar el egreso con el animal correspondiente
  },
  numFicha: {
    type: String,
    required: true
  },
  fechaEgreso: {
    type: Date,
    required: true
  },
  motivoEgreso: {
    type: String,
    enum: ['Liberación', 'Escape', 'Muerte', 'Eutanasia', 'Derivación', 'Canje'],
    required: true
  },
  lugarEgreso: {
    establecimiento: {
      type: String,
      required: true
    },
    localidad: {
      type: String,
      required: true
    },
    provincia: {
      type: String,
      required: true
    }
  },
  participacionFauna: {
    participacion: {
      type: Boolean,
      required: true
    },
    razon: {
      type: String
    }
  },
  observaciones: {
    type: String
  },
  activo: {
    type: Boolean,
    default: true
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
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
}, { versionKey: false });

const Egreso = mongoose.model('Egreso', egresoSchema);

module.exports = Egreso;
