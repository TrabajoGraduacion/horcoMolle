const mongoose = require('mongoose');
const { Schema } = mongoose;

const tratamientoSchema = new Schema({
  fecha: {
    type: Date,
    required: true
  },
  tipoTratamiento: {
    type: String,
    enum: ['Farmacológico', 'No farmacológico'],
    required: true
  },
  detalleNoFarmacologico: {
    type: String,
    required: function() { return this.tipoTratamiento === 'No farmacológico'; }
  },
  farmaco: {
    nombreComercial: {
      type: String,
      required: function() { return this.tipoTratamiento === 'Farmacológico'; }
    },
    nombreDroga: {
      type: String,
      required: function() { return this.tipoTratamiento === 'Farmacológico'; }
    },
    concentration: {
      type: String,
      required: function() { return this.tipoTratamiento === 'Farmacológico'; }
    }
  },
  dosis: {
    dosisEspecie: {
      type: String,
      required: function() { return this.tipoTratamiento === 'Farmacológico'; }
    },
    dosisPractica: {
      type: String,
      required: function() { return this.tipoTratamiento === 'Farmacológico'; }
    },
    viaAdministracion: {
      type: String,
      required: function() { return this.tipoTratamiento === 'Farmacológico'; }
    },
    frecuencia: {
      type: String,
      required: function() { return this.tipoTratamiento === 'Farmacológico'; }
    },
    tiempoTratamiento: {
      type: String,
      required: function() { return this.tipoTratamiento === 'Farmacológico'; }
    },
    exitoAdministracion: {
      type: String,
      required: function() { return this.tipoTratamiento === 'Farmacológico'; }
    }
  },
  responsable: {
    type: String,
    required: true
  },
  observaciones: {
    type: String
  },
  adjuntos: [{
    type: String
  }],
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
  modificadoEn: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

const Tratamiento = mongoose.model('Tratamiento', tratamientoSchema);

module.exports = Tratamiento;
