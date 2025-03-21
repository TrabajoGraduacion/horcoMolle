const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recintosSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  fechaInstalacion: {
    type: Date,
    required: true
  },
  codigo: String,
  ubicacion: String,
  especie: String,
  numeroIndividuosRecomendados: {
    type: Number,
    default: 0
  },
  descripcionRecinto: String,
  condicionesAmbientales: String,
  condicionesBioseguridad: String,
  calidadDidactica: String,
  fotos: [String],

  dimensionesGenerales: {
    largo: Number,
    ancho: Number,
    alto: Number,
    area: Number,
    alaIzquierda: {
      largo: Number,
      ancho: Number,
      alto: Number,
      area: Number
    },
    alaDerecha: {
      largo: Number,
      ancho: Number,
      alto: Number,
      area: Number
    }
  },

  ambientesExternos: [
    {
      nombre: String,
      dimensiones: {
        largo: Number,
        ancho: Number,
        alto: Number,
        area: Number
      },
      estructura: {
        coberturaLateral: String,
        sosten: String,
        coberturaSuperior: String,
        mangasJaulasManejo: String
      },
      ambientacion: {
        comederosBebederos: String,
        refugios: String,
        vegetacion: String,
        clima: String
      },
      observaciones: String
    }
  ],

  ambientesInternos: [
    {
      nombre: String,
      dimensiones: {
        largo: Number,
        ancho: Number,
        alto: Number,
        area: Number
      },
      estructura: {
        coberturaLateral: String,
        sosten: String,
        coberturaSuperior: String,
        mangasJaulasManejo: String
      },
      ambientacion: {
        comederos: String,
        refugios: String,
        vegetacion: String,
        clima: String
      },
      observaciones: String
    }
  ],

  activo: {
    type: Boolean,
    default: true
  },
  creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, 
{
  versionKey: false,
  timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" }, // Definir timestamps personalizados
});

const Recinto = mongoose.model('Recinto', recintosSchema);

module.exports = Recinto;
