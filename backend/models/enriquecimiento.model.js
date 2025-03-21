const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enriquecimientoSchema = new Schema({
  animalId: {
    type: Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
    description: "Referencia al ID del animal"
  },
  observador: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    description: "Usuario que realiza la observación"
  },
  fechaEnriquecimiento: {
    type: Date,
    required: true,
    description: "Fecha del enriquecimiento"
  },
  horaInicio: {
    type: String,
    required: true,
    description: "Hora de inicio del enriquecimiento"
  },
  duracion: {
    type: String,
    required: true,
    description: "Duración del enriquecimiento"
  },
  clima: {
    type: String,
    description: "Condiciones climáticas durante el enriquecimiento"
  },
  temperatura: {
    type: String,
    description: "Temperatura durante el enriquecimiento"
  },
  humedad: {
    type: String,
    description: "Humedad durante el enriquecimiento"
  },
  contexto: {
    type: String,
    description: "Contexto del momento en que se inicia la observación"
  },
  tipoEnriquecimiento: {
    type: String,
    required: true,
    description: "Tipo de enriquecimiento realizado"
  },
  comportamiento: {
    type: String,
    description: "Comportamiento observado durante el enriquecimiento"
  },
  intensidad: {
    type: String,
    description: "Intensidad del comportamiento"
  },
  notasAdicionales: {
    type: String,
    description: "Notas adicionales relacionadas con el enriquecimiento"
  },
  resultados: {
    type: String,
    description: "Resultados observados del enriquecimiento"
  },
  fotosArchivos: {
    type: [String],
    description: "Archivos o fotos adjuntos relacionados con el enriquecimiento"
  },
  activo: {
    type: Boolean,
    default: true,
    description: "Indica si el registro está activo"
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    description: "Usuario que creó el registro"
  }
}, { timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' } });

const Enriquecimiento = mongoose.model('Enriquecimiento', enriquecimientoSchema);

module.exports = Enriquecimiento;
