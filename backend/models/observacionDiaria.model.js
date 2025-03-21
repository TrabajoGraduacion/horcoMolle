const mongoose = require("mongoose");
const { Schema } = mongoose;

const observacionDiariaSchema = new Schema(
  {
    animalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },
    fechaObservacion: {
      type: Date,
      required: true,
    },
    hora: {
      type: String,
      required: true,
    },
    duracion: {
      type: String,
      required: true,
    },
    contextoAmbiental: {
      type: String,
      required: true,
    },
    enfoqueComportamental: {
      actividad: {
        type: String,
      },
      social: {
        type: String,
      },
      comportamental: {
        type: String,
      },
      nutricion: {
        type: String,
      },
      manejo: {
        type: String,
      },
    },
    archivosEnfoqueComportamental: [{
      type: String // URLs de Cloudinary para enfoque comportamental
    }],
    enfoqueSalud: {
      condicionFisica: {
        type: String,
      },
      discapacidad: {
        type: String,
      },
      condicionGeneral: {
        type: String,
      },
    },
    archivosEnfoqueSalud: [{
      type: String // URLs de Cloudinary para enfoque salud
    }],
    enfoqueAmbiental: {
      ambienteExterno: {
        tiempoPermanencia: {
          type: String,
        },
        higiene: {
          type: String,
        },
        seguridad: {
          type: String,
        },
      },
      ambienteInterno: {
        tiempoPermanencia: {
          type: String,
        },
        higiene: {
          type: String,
        },
        seguridad: {
          type: String,
        },
        bioseguridadManejador: {
          type: String,
        },
        bioseguridadAnimal: {
          type: String,
        },
      },
    },
    archivosEnfoqueAmbiental: [{
      type: String // URLs de Cloudinary para enfoque ambiental
    }],
    realizadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" },
  }
);

const ObservacionDiaria = mongoose.model(
  "ObservacionDiaria",
  observacionDiariaSchema
);

module.exports = ObservacionDiaria;

