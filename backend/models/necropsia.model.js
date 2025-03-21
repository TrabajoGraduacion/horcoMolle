const mongoose = require("mongoose");
const { Schema } = mongoose;

const necropsiaSchema = new Schema({
  fechaMuerte: { type: Date },
  fechaNecropsia: { type: Date, default: Date.now, required: true },
  conservacionCarcasa: { type: String, enum: ["Refrigerado", "Congelado", "No"] },
  condicionMuerte: { type: String, enum: ["Natural", "Eutanasia"] },
  localNecropsia: { type: String },
  personaRealiza: { type: String },
  historiaClinica: { type: String },
  sospechaClinica: { type: String },
  descripcionNecroscopica: {
    examenGeneral: { type: String }, // condición física y nutricional; pelaje; plumaje; escamas; orificios naturales
    cavidadesCorporeas: { type: String }, // depósitos de grasa; celoma; peritoneo; pleura; sacos aéreos
    sistemaMusculoEsqueletico: { type: String }, // huesos, musculatura, articulaciones, tendones, caparazón
    sistemaRespiratorio: { type: String }, // narinas, senos paranasales, laringe, tráquea, bronquios, pulmones, sacos aéreos, siringe
    sistemaCardiovascular: { type: String }, // corazón, válvulas, pericardio, grandes vasos
    sistemaDigestivo: { type: String }, // boca, dientes, glándula salival, lengua, esófago, estómago, intestino delgado y grueso, ciego, hígado, vesícula biliar, páncreas, buche, molleja, proventrículo, cloaca
    sistemaLinfoHematopoyetico: { type: String }, // amígdalas, timo, bazo, linfonódulos, médula ósea, bursa
    sistemaUrinario: { type: String }, // riñón, uréteres, vejiga, uretra, cloaca
    sistemaReproductor: { type: String }, // gónadas, oviducto, órganos sexuales accesorios, glándula de veneno
    sistemaEndocrino: { type: String }, // tiroides, paratiroides, adrenales, hipófisis
    sistemaNerviosoCentral: { type: String }, // ojos, oídos, encéfalo, meninges, médula espinal
  },
  otrasObservaciones: {
    evidenciaAlimentoEstomago: { type: Boolean }, 
    diagnosticosPreliminares: { type: String },
    causaMuertePreliminar: { type: String },
    comentariosAdicionales: { type: String },
    estudiosLaboratorio: { type: String },
    estadoMaterial: { type: String },
  },
  archivosAdjuntos: [{ type: String }], // Carpeta de imágenes accesible para todos los tipos de necropsia
  observacionesGenerales: { type: String },
});

const Necropsia = mongoose.model("Necropsia", necropsiaSchema);

module.exports = Necropsia;
