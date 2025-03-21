const mongoose = require("mongoose");

const { Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    apellido: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Correo no válido"],
    },
    contrasena: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 100,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    rol: {
      type: String,
      enum: ["Administrador", "Guardafauna", "Docente"],
      default: "Docente",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" },
  }
);

const usuarioModel = mongoose.model("usuarios", usuarioSchema);

module.exports = usuarioModel;
