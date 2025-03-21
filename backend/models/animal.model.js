const mongoose = require('mongoose');

const { Schema } = mongoose;

const animalSchema = new Schema({
  nombreVulgar: { type: String },  // Nombre vulgar del animal
  nombreCientifico: { type: String },  // Nombre científico
  pseudonimo: { type: String },  // Pseudónimo del animal
  nombreInstitucional: { type: String },  // Nombre institucional
  chipNumero: { type: String },  // Número de chip
  anilloCaravanaIdentificacion: { type: String },  // Identificación por anillo o caravana
  sexo: { type: String, enum: ['Macho', 'Hembra', 'Indefinido'] },  // Sexo
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },  // Usuario que creó el registro
  activo: { type: Boolean, default: true },  // Estado del animal

}, { timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' } });

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
