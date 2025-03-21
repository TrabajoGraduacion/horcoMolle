const mongoose = require("mongoose");
const { Schema } = mongoose;

const anestesiaSchema = new Schema({
  fecha: { type: Date },
  lugarAnestesia: { type: String },
  temperaturaAmbiente: { type: Number },

  protocoloAnestesico: {
    motivoAnestesia: { type: String },
    tiempoAyuno: {
      comida: { type: Number },
      agua: { type: Number },
    },
    metodoContencion: { type: String },
    inicioAnestesia: { type: String },
    inicioIntervencion: { type: String },
    decubito: { type: String },
    diametroTuboEndotraqueal: { type: Number },
    finIntervencion: { type: String },
    finAnestesia: { type: String },
    duracionAnestesia: { type: String },

    drogas: [
      {
        hora: { type: String },
        farmaco: { type: String },
        concentracion: { type: Number },
        dosis: { type: Number },
        volumen: { type: Number },
        tipo: {
          type: String,
          enum: ["T", "I", "S", "M", "A", "O"],
          description: "T-tranquilizante, I-inmovilizante, S-suplemento, M-mantenimiento, A-antagonista, O-otros",
        },
        medioVia: {
          type: String,
          enum: ["J", "C", "D", "B", "R", "IM", "SC", "EV", "IN"],
          description: "J-jeringa, C-cerbatana, D-dardo, B-bater, R-rifle, Vía: IM, SC, EV, IN",
        },
        exitoAplicacion: {
          type: String,
          enum: ["T", "P", "N"],
          description: "T-total, P-parcial, N-ninguna",
        },
        efecto: {
          type: Number,
          enum: [0, 1, 2, 3, 4, 5],
          description: "0-ninguno, 1-ligero, 2-moderado, 3-profundo, 4-excesivo/profundo, 5-deceso",
        },
      },
    ],
  },

  recuperacionAnestesia: {
    tiempoRecuperacion: { type: Number },
    estado: {
      type: String,
      enum: ["tranquila", "agitada", "re-sedación"],
    },
    controlCabeza: { type: String },
    estacion: { type: String },
    recuperacionCompleta: { type: String },
  },

  retorno: {
    tipo: {
      type: String,
      enum: ["Normal", "Prolongado", "Deceso"],
    },
    complicaciones: [
      {
        type: String,
        enum: ["Ninguna", "Apnea", "Regurgitación/Vómito", "Secreciones", "Otras"],
      },
    ],
  },

  evaluacionAnestesia: {
    type: String,
    enum: ["Excelente", "Buena", "Regular", "Mala", "Pésima"],
  },

  monitoreo: [
    {
      hora: { type: String },
      frecuenciaRespiratoria: { type: Number },
      frecuenciaCardiaca: { type: Number },
      pulso: { type: String },
      temperatura: { type: Number },
      presionArterial: {
        PAS: { type: Number },
        PAD: { type: Number },
        PAM: { type: Number },
      },
      saturacionOxigeno: { type: Number },
      tiempoLlenadoCapilar: { type: String },
      estadoHidratacion: { type: String },
      reflejos: { type: String },
      comentarios: { type: String },
    },
  ],

  tratamientoFluidoterapia: [
    {
      hora: { type: String },
      farmaco: { type: String },
      dosis: { type: Number },
      via: { type: String },
      comentarios: { type: String },
    },
  ],

  adjuntos: [{ type: String }],

  responsable: { type: String },
  activo: { type: Boolean, default: true },
  creadoPor: { type: Schema.Types.ObjectId, ref: "Usuario" },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now },
}, { timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" } });

const Anestesia = mongoose.model("Anestesia", anestesiaSchema);

module.exports = Anestesia;
