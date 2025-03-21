const mongoose = require('mongoose');

const { Schema } = mongoose;

const ingresoSchema = new Schema({
  animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },  // Relación con el animal
  fechaIngreso: { type: Date },  // Fecha de ingreso

  // Edad en categoría y exacta
  edadCategoria: { type: String, enum: ['Cría', 'Juvenil', 'Subadulto', 'Adulto']},  // Categoría de edad
  edadExacta: {
    valor: { type: Number },  // Valor numérico de la edad
    unidad: { type: String, enum: ['Meses', 'Años'] }  // Unidad de la edad (Meses o Años)
  },

  // Información del recinto
  recintoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recinto' },  // Relación con el recinto
  condicionRecinto: { type: String, enum: ['Cuarentena', 'Rehabilitación', 'Plantel Permanente', 'Internación Veterinaria', 'Presuelta', 'Tenencia Responsable']},  // Condición del recinto

  // Datos de salud
  estadoSalud: { type: String },  // Condición de salud al momento del ingreso
  peso: { type: mongoose.Decimal128},  // Peso del animal
  medidasBiometricas: { type: String },  // Medidas biométricas del animal

  // Origen y motivo del ingreso
  origen: { type: String, enum: ['Rescate', 'Compra', 'Donación', 'Derivación', 'Decomiso'] },  // Origen del animal
  motivoRescate: { type: String, enum: ['Ataque Animal', 'Ataque Humano', 'Acc. Auto', 'Acc. Doméstico', 'Fuera de hábitat', 'Decaído', 'Otro']},  // Motivo del rescate
  historiaVida: { type: String },  // Historia del animal antes del ingreso
  infraccionNumero: { type: String },  // Número de infracción, si aplica
  autorizacionIntervencion: { type: String },  // Autorización de intervención si aplica

  // Lugar de obtención
  lugarObtencion: {
    lugar: { type: String, enum: ['Hogar', 'Vía Pública', 'Establecimiento', 'Otro'] },  // Lugar donde se obtuvo el animal
    direccion: { type: String },  // Dirección del lugar de obtención
    localidad: { type: String },  // Localidad del lugar de obtención
    provincia: { type: String }  // Provincia del lugar de obtención
  },

  // Datos de cautiverio
  fechaInicioCautiverio: { type: Date },  // Fecha de inicio del cautiverio
  tiempoCautiverio: { type: String },  // Duración del cautiverio
  alimentacionRecibida: { type: String },  // Alimentación recibida durante el cautiverio
  condicionCautiverio: { type: String },  // Condiciones del cautiverio
  motivoAtencionVeterinaria: { type: String },  // Motivo de atención veterinaria si aplica
  veterinario: { type: String },  // Nombre del veterinario
  contactoVeterinario: { type: String },  // Contacto del veterinario
  observacionesVeterinarias: { type: String },  // Observaciones veterinarias

  // Información del donante
  donante: {
    apellido: { type: String },
    nombre: { type: String },
    dni: { type: String },
    domicilio: { type: String },
    localidad: { type: String },
    provincia: { type: String },
    telefono: { type: String },
    email: { type: String },
    contactoFauna: { type: Boolean, default: false }  // Si ha tenido contacto con fauna
  },

  // Autorización del ingreso
  docenteAutorizaIngreso: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },  // Usuario que autoriza el ingreso

  // Notas adicionales y archivos
  notasAdicionales: { type: String },  // Notas adicionales relevantes
  archivos: [{ type: String }],  // Archivos o fotos adjuntos (imagenes, documentos, etc.)

  // Creación y estado
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },  // Usuario que crea el registro
  activo: { type: Boolean, default: true },  // Estado del ingreso (activo/inactivo)

}, { timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' } });

const Ingreso = mongoose.model('Ingreso', ingresoSchema);

module.exports = Ingreso;
