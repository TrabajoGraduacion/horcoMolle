const mongoose = require("mongoose");
const { Schema } = mongoose;

const dienteSchema = {
  movilidad: { type: String },
  retraccion: { type: Number },
  bolsaPeriodontal: { type: Number },  // BP
  exposicionFurca: { type: String },   // EF: grado I, II, III
  hiperplasiaGingival: { type: Boolean },  // HG
  calculo: { type: String },          // C: grado I, II, III
  placa: { type: String },            // P: grado I, II, III
  gingivitis: { type: Boolean },
  ausenciaDiente: { type: Boolean },   // ED (extracted tooth)
  exposicionPulpa: { type: Boolean },  // EP (pulp exposure)
  dienteSupernumerario: { type: Boolean }, // SN
  giroVersion: { type: Boolean },
  diastema: { type: Boolean },
  apiñamiento: { type: Boolean },       // AP (crowding)
  oscurecimientoDentina: { type: Boolean }, // OD (dentin darkening)
  erosionEsmalte: { type: Boolean },    // EE
  hipoplasiaEsmalte: { type: Boolean }, // HE
  lesionReabsorcion: { type: Boolean }  // Lesion de reabsorcion
};

const odontogramaSchema = new Schema({
  fecha: { type: Date, required: true },
  proximaRevision: { type: Date },
  examenGeneral: {
    facialExtraOral: { type: String },
    labios: { type: String },
    gangliosLinfaticos: { type: String },
    amigdalas: { type: String },
    mucosas: { type: String },
    paladar: { type: String },
    faringe: { type: String },
  },
  canidos: {
    superiorDerecho: {
      "110": { type: dienteSchema },
      "109": { type: dienteSchema },
      "108": { type: dienteSchema },
      "107": { type: dienteSchema },
      "106": { type: dienteSchema },
      "105": { type: dienteSchema },
      "104": { type: dienteSchema },
      "103": { type: dienteSchema },
      "102": { type: dienteSchema },
      "101": { type: dienteSchema }
    },
    superiorIzquierdo: {
      "201": { type: dienteSchema },
      "202": { type: dienteSchema },
      "203": { type: dienteSchema },
      "204": { type: dienteSchema },
      "205": { type: dienteSchema },
      "206": { type: dienteSchema },
      "207": { type: dienteSchema },
      "208": { type: dienteSchema },
      "209": { type: dienteSchema },
      "210": { type: dienteSchema }
    },
    inferiorDerecho: {
      "411": { type: dienteSchema },
      "410": { type: dienteSchema },
      "409": { type: dienteSchema },
      "408": { type: dienteSchema },
      "407": { type: dienteSchema },
      "406": { type: dienteSchema },
      "405": { type: dienteSchema },
      "404": { type: dienteSchema },
      "403": { type: dienteSchema },
      "402": { type: dienteSchema },
      "401": { type: dienteSchema }
    },
    inferiorIzquierdo: {
      "301": { type: dienteSchema },
      "302": { type: dienteSchema },
      "303": { type: dienteSchema },
      "304": { type: dienteSchema },
      "305": { type: dienteSchema },
      "306": { type: dienteSchema },
      "307": { type: dienteSchema },
      "308": { type: dienteSchema },
      "309": { type: dienteSchema },
      "310": { type: dienteSchema },
      "311": { type: dienteSchema }
    }
  },
  felinos: {
    superiorDerecho: {
      "109": { type: dienteSchema },
      "108": { type: dienteSchema },
      "107": { type: dienteSchema },
      "106": { type: dienteSchema },
      "105": { type: dienteSchema },
      "104": { type: dienteSchema },
      "103": { type: dienteSchema },
      "102": { type: dienteSchema },
      "101": { type: dienteSchema }
    },
    superiorIzquierdo: {
      "201": { type: dienteSchema },
      "202": { type: dienteSchema },
      "203": { type: dienteSchema },
      "204": { type: dienteSchema },
      "205": { type: dienteSchema },
      "206": { type: dienteSchema },
      "207": { type: dienteSchema },
      "208": { type: dienteSchema },
      "209": { type: dienteSchema }
    },
    inferiorDerecho: {
      "409": { type: dienteSchema },
      "408": { type: dienteSchema },
      "407": { type: dienteSchema },
      "406": { type: dienteSchema },
      "405": { type: dienteSchema },
      "404": { type: dienteSchema },
      "403": { type: dienteSchema },
      "402": { type: dienteSchema },
      "401": { type: dienteSchema }
    },
    inferiorIzquierdo: {
      "301": { type: dienteSchema },
      "302": { type: dienteSchema },
      "303": { type: dienteSchema },
      "304": { type: dienteSchema },
      "305": { type: dienteSchema },
      "306": { type: dienteSchema },
      "307": { type: dienteSchema },
      "308": { type: dienteSchema },
      "309": { type: dienteSchema }
    }
  },
  primates: {
    superiorDerecho: {
      "109": { type: dienteSchema },
      "108": { type: dienteSchema },
      "107": { type: dienteSchema },
      "106": { type: dienteSchema },
      "105": { type: dienteSchema },
      "104": { type: dienteSchema },
      "103": { type: dienteSchema },
      "102": { type: dienteSchema },
      "101": { type: dienteSchema }
    },
    superiorIzquierdo: {
      "201": { type: dienteSchema },
      "202": { type: dienteSchema },
      "203": { type: dienteSchema },
      "204": { type: dienteSchema },
      "205": { type: dienteSchema },
      "206": { type: dienteSchema },
      "207": { type: dienteSchema },
      "208": { type: dienteSchema },
      "209": { type: dienteSchema }
    },
    inferiorDerecho: {
      "409": { type: dienteSchema },
      "408": { type: dienteSchema },
      "407": { type: dienteSchema },
      "406": { type: dienteSchema },
      "405": { type: dienteSchema },
      "404": { type: dienteSchema },
      "403": { type: dienteSchema },
      "402": { type: dienteSchema },
      "401": { type: dienteSchema }
    },
    inferiorIzquierdo: {
      "301": { type: dienteSchema },
      "302": { type: dienteSchema },
      "303": { type: dienteSchema },
      "304": { type: dienteSchema },
      "305": { type: dienteSchema },
      "306": { type: dienteSchema },
      "307": { type: dienteSchema },
      "308": { type: dienteSchema },
      "309": { type: dienteSchema }
    },
  },
  tapires: {
    superiorDerecho: {
      "110": { type: dienteSchema },
      "109": { type: dienteSchema },
      "108": { type: dienteSchema },
      "107": { type: dienteSchema },
      "106": { type: dienteSchema },
      "105": { type: dienteSchema },
      "104": { type: dienteSchema },
      "103": { type: dienteSchema },
      "102": { type: dienteSchema },
      "101": { type: dienteSchema }
    },
    superiorIzquierdo: {
      "201": { type: dienteSchema },
      "202": { type: dienteSchema },
      "203": { type: dienteSchema },
      "204": { type: dienteSchema },
      "205": { type: dienteSchema },
      "206": { type: dienteSchema },
      "207": { type: dienteSchema },
      "208": { type: dienteSchema },
      "209": { type: dienteSchema },
      "210": { type: dienteSchema }
    },
    inferiorDerecho: {
      "410": { type: dienteSchema },
      "409": { type: dienteSchema },
      "408": { type: dienteSchema },
      "407": { type: dienteSchema },
      "406": { type: dienteSchema },
      "405": { type: dienteSchema },
      "404": { type: dienteSchema },
      "403": { type: dienteSchema },
      "402": { type: dienteSchema },
      "401": { type: dienteSchema }
    },
    inferiorIzquierdo: {
      "301": { type: dienteSchema },
      "302": { type: dienteSchema },
      "303": { type: dienteSchema },
      "304": { type: dienteSchema },
      "305": { type: dienteSchema },
      "306": { type: dienteSchema },
      "307": { type: dienteSchema },
      "308": { type: dienteSchema },
      "309": { type: dienteSchema },
      "310": { type: dienteSchema }
    }
  },
  cervidos: {
    superiorDerecho: {
      "108": { type: dienteSchema },
      "107": { type: dienteSchema },
      "106": { type: dienteSchema },
      "105": { type: dienteSchema },
      "104": { type: dienteSchema },
      "103": { type: dienteSchema },
      "102": { type: dienteSchema },
      "101": { type: dienteSchema }
    },
    superiorIzquierdo: {
      "201": { type: dienteSchema },
      "202": { type: dienteSchema },
      "203": { type: dienteSchema },
      "204": { type: dienteSchema },
      "205": { type: dienteSchema },
      "206": { type: dienteSchema },
      "207": { type: dienteSchema },
      "208": { type: dienteSchema }
    },
    inferiorDerecho: {
      "410": { type: dienteSchema },
      "409": { type: dienteSchema },
      "408": { type: dienteSchema },
      "407": { type: dienteSchema },
      "406": { type: dienteSchema },
      "405": { type: dienteSchema },
      "404": { type: dienteSchema },
      "403": { type: dienteSchema },
      "402": { type: dienteSchema },
      "401": { type: dienteSchema },
      "301": { type: dienteSchema }
    },
    inferiorIzquierdo: {
      "301": { type: dienteSchema },
      "302": { type: dienteSchema },
      "303": { type: dienteSchema },
      "304": { type: dienteSchema },
      "305": { type: dienteSchema },
      "306": { type: dienteSchema },
      "307": { type: dienteSchema },
      "308": { type: dienteSchema },
      "309": { type: dienteSchema },
      "310": { type: dienteSchema }
    }
  },
  coipos: {
    superiorDerecho: {
      "105": { type: dienteSchema },
      "104": { type: dienteSchema },
      "103": { type: dienteSchema },
      "102": { type: dienteSchema },
      "101": { type: dienteSchema }
    },
    superiorIzquierdo: {
      "201": { type: dienteSchema },
      "202": { type: dienteSchema },
      "203": { type: dienteSchema },
      "204": { type: dienteSchema },
      "205": { type: dienteSchema }
    },
    inferiorDerecho: {
      "405": { type: dienteSchema },
      "404": { type: dienteSchema },
      "403": { type: dienteSchema },
      "402": { type: dienteSchema },
      "401": { type: dienteSchema }
    },
    inferiorIzquierdo: {
      "301": { type: dienteSchema },
      "302": { type: dienteSchema },
      "303": { type: dienteSchema },
      "304": { type: dienteSchema },
      "305": { type: dienteSchema }
    }
  },
  pecaris: {
    superiorDerecho: {
      "109": { type: dienteSchema },
      "108": { type: dienteSchema },
      "107": { type: dienteSchema },
      "106": { type: dienteSchema },
      "105": { type: dienteSchema },
      "104": { type: dienteSchema },
      "103": { type: dienteSchema },
      "102": { type: dienteSchema },
      "101": { type: dienteSchema }
    },
    superiorIzquierdo: {
      "201": { type: dienteSchema },
      "202": { type: dienteSchema },
      "203": { type: dienteSchema },
      "204": { type: dienteSchema },
      "205": { type: dienteSchema },
      "206": { type: dienteSchema },
      "207": { type: dienteSchema },
      "208": { type: dienteSchema },
      "209": { type: dienteSchema }
    },
    inferiorDerecho: {
      "410": { type: dienteSchema },
      "409": { type: dienteSchema },
      "408": { type: dienteSchema },
      "407": { type: dienteSchema },
      "406": { type: dienteSchema },
      "405": { type: dienteSchema },
      "404": { type: dienteSchema },
      "403": { type: dienteSchema },
      "402": { type: dienteSchema },
      "401": { type: dienteSchema }
    },
    inferiorIzquierdo: {
      "301": { type: dienteSchema },
      "302": { type: dienteSchema },
      "303": { type: dienteSchema },
      "304": { type: dienteSchema },
      "305": { type: dienteSchema },
      "306": { type: dienteSchema },
      "307": { type: dienteSchema },
      "308": { type: dienteSchema },
      "309": { type: dienteSchema },
      "310": { type: dienteSchema }
    }
  },
  archivosAdjuntos: [{ type: String }],
  observacionesGenerales: { type: String },
});

const Odontograma = mongoose.model("Odontograma", odontogramaSchema);

module.exports = Odontograma;
