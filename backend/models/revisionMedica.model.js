const mongoose = require("mongoose");
const { Schema } = mongoose;

const revisionMedicaSchema = new Schema({
  tipoRevision: {
    type: String,
    enum: ["Mamiferos", "Aves", "Reptiles"]
  },
  mamiferos: {
    motivoRevision: {
      type: String,
      enum: ["ingreso", "tratamiento", "revisión anual", "expresión de patología", "otro"]
    },
    examenObjetivoGeneral: {
      estadoSensorio: { type: String },
      fascia: { type: String },
      actitudesPosturas: { type: String },
      estadoNutricion: { type: String },
      estadoPielManto: { type: String },
      coloracionMucosas: { type: String },
      nodulosLinfaticos: { type: String },
      estadoHidratacion: { type: String },
      constantesFisiologicas: {
        temperatura: { type: Number }, // En °C
        frecuenciaCardiaca: { type: Number },
        frecuenciaRespiratoria: { type: Number },
        tiempoLlenadoCapilar: { type: String },
      },
    },
    funcional: {
      topografico: {
        cabezaCuello: {
          pupilas: { type: String },
          cavidadBucal: { type: String },
          piezasDentarias: { type: String },
          oidos: { type: String },
        },
        torax: { type: String },
        abdomen: { type: String },
        aparatoUrinarioReproductor: { type: String },
        aparatoLocomotor: { type: String },
        aparatoEstaticoDinamico: { type: String },
        aparatoMusculoesqueletico: { type: String },
        estacionDecubito: { type: String },
      },
      sistemaRespiratorio: {
        descripcion: { type: String },
        frecuenciaRespiratoriaRitmo: { type: String },
        cavidadNasal: { type: String },
        senos: { type: String },
        laringe: { type: String },
        traquea: { type: String },
        toraxAreaPulmonar: { type: String },
      },
      sistemaCardiovascular: {
        inspeccion: { type: String },
        auscultacion: { type: String },
        frecuenciaCardiaca: { type: Number },
        ritmo: { type: String },
        soplos: { type: String },
        pulso: { type: String },
        presionArterial: {
          PAS: { type: Number },
          PAD: { type: Number },
          PAM: { type: Number },
        },
      },
      sistemaDigestivo: {
        boca: { type: String },
        esofago: { type: String },
        higado: { type: String },
        estomago: { type: String },
        intestinoDelgado: { type: String },
        intestinoGrueso: { type: String },
        recto: { type: String },
        ano: { type: String },
      },
      sistemaUrinario: {
        rinones: { type: String },
        vejiga: { type: String },
        uretra: { type: String },
      },
      sistemaReproductor: {
        hembra: {
          vulva: { type: String },
          vestibulo: { type: String },
          vagina: { type: String },
          utero: { type: String },
          ovarios: { type: String },
        },
        macho: {
          escroto: { type: String },
          testiculos: { type: String },
          epididimo: { type: String },
          conductoDeferente: { type: String },
          prepucio: { type: String },
          pene: { type: String },
          glandulasAccesorias: { type: String },
        },
      },
      sistemaNervioso: {
        sensorio: { type: String },
        facies: { type: String },
        actitud: { type: String },
      },
      tonoMuscular: { type: String },
      reaccionPostural: { type: String },
      reflejos: { type: String },
      sensibilidad: { type: String },
      trofismoMuscular: { type: String },
    },
    sistemaMusculoesqueletico: { type: String },
    sistemaEndocrino: {
      tiroides: { type: String },
      paratiroides: { type: String },
      adrenal: { type: String },
      hipofisis: { type: String },
    },
    diagnostico: {
      presuntivo: { type: String },
      definitivo: { type: String },
      pronostico: { type: String },
    },
  },
  aves: {
    motivoRevision: {
      type: String,
      enum: ["ingreso", "tratamiento", "revisión anual", "expresión de patología", "otro"]
    },
    exploracionGeneral: {
      estadoSensorio: { type: String },
      actitudesPosturas: { type: String },
      estadoNutricion: { type: String },
      estadoPielPlumas: { type: String },
      coloracionMucosas: { type: String },
      nodulosLinfaticos: { type: String },
      estadoHidratacion: { type: String },
      constantesFisiologicas: {
        temperatura: { type: Number }, // en °C
        frecuenciaCardiaca: { type: Number },
        frecuenciaRespiratoria: { type: Number },
        tiempoLlenadoCapilar: { type: String },
      },
    },
    exploracionParticular: {
      pielPlumaje: {
        colorPlumas: { type: String },
        ectoparasitos: { type: String },
        heridasLaceraciones: { type: String },
        glandulaUropigia: {
          color: { type: String },
          secrecion: { type: String },
        },
      },
      cabezaCuello: {
        pico: {
          aspecto: { type: String },
          simetria: { type: String },
          consistencia: { type: String },
          lesiones: { type: String },
        },
        narinas: {
          tamanoAspecto: { type: String },
          secreciones: { type: String },
        },
        cavidadBucal: {
          colorMucosas: { type: String },
          lesiones: { type: String },
        },
        ojos: {
          lesiones: { type: String },
          estadoHidratacion: { type: String },
          pupilas: { type: String },
        },
        oidos: {
          secreciones: { type: String },
          cuerposExtranos: { type: String },
          ectoparasitos: { type: String },
        },
        esofagoBuche: {
          palpacion: { type: String },
          contenido: { type: String },
        },
        traquea: {
          palpacion: { type: String },
          transluminacion: { type: String },
        },
      },
      cuerpo: {
        inspeccion: { type: String }, // Heridas, laceraciones, inflamación
        palpacionSimetria: { type: String }, // Simetría lado derecho e izquierdo
        musculosPectorales: { type: String }, // Auscultación cardiaca y pulmonar
        abdomen: { type: String }, // Palpación del abdomen
        cloaca: { type: String }, // Inspección de la cloaca
      },
      extremidades: {
        alas: {
          lesionesHeridas: { type: String },
          simetria: { type: String },
          fracturas: { type: String },
          plumas: {
            primarias: { type: String },
            secundarias: { type: String },
            cobertoras: { type: String },
          },
          pruebaFuncionalidadVuelo: { type: String },
        },
        miembrosInferiores: {
          simetria: { type: String },
          lesionesHeridas: { type: String },
          fracturas: { type: String },
        },
      },
      capacidadDeMantenerse: {
        enPie: { type: String },
        caminar: { type: String },
      },
    },
  },
  reptiles: {
    inspeccionGeneral: {
      observacionEstadoReposo: { type: String },
      deambulacion: { type: String },
      estadoGeneralCorporalCaparazon: { type: String }, // en caso de quelonios
    },
    inspeccionPalpacionParticular: {
      cabeza: {
        ojos: {
          brillo: { type: String },
          movilidad: { type: String },
          gradoHidratacion: { type: String },
          reflejoPalpebralCorneal: { type: String },
          especulo: { coloracion: { type: String } },
        },
        membranasTimpanicas: {
          aspecto: { type: String },
          lesiones: { type: String },
        },
        pico: {
          crecimiento: { type: String },
          oclusion: { type: String },
        },
        cavidadBucal: {
          brillo: { type: String },
          colorMucosas: { type: String },
          hidratacion: { type: String },
          presenciaLesionesSecreciones: { type: String },
        },
        narinas: {
          presenciaSecreciones: { type: String },
        },
        piel: { coloracionLesiones: { type: String } },
      },
      cuello: {
        piel: {
          presenciaLesiones: { type: String },
          coloracion: { type: String },
          mudaEcdisis: { type: String },
          ectoparasitos: { type: String },
        },
        esofagoTraquea: { palpacion: { type: String } },
      },
      miembros: {
        anterioresPosteriores: {
          fracturas: { type: String },
          alteracionEjes: { type: String },
        },
        pielEscamas: {
          heridas: { type: String },
          presenciaEctoparasitos: { type: String },
          ecdisis: { type: String },
        },
        unas: { type: String }, // Campo de tipo String para unas
        musculatura: {
          funcionalidad: { type: String },
          movilidad: { type: String },
          flexionExtensionForzadas: { type: String },
          reflejoRetirada: { type: String },
        },
      },
      caparazon: {
        inspeccion: {
          tamano: { type: String },
          forma: { type: String },
          color: { type: String },
          integridad: { type: String },
        },
        escudosAnillosCorneos: {
          color: { type: String },
          simetria: { type: String },
          integridad: { type: String },
          numeroEscudos: { type: String },
        },
        espaldaPeto: {
          inspeccionSimetria: { type: String },
          palpacionPresion: { type: String }, // Campo de tipo String para palpacionPresion
          percusionAreaPulmonar: { type: String },
        },
      },
      quelonios: {
        cavidadCelomica: {
          fosasAxilaresInguinales: { type: String }, // Inspección de piel y tejidos subyacentes
          palpacionProfunda: { type: String }, // Campo de tipo String para palpacionProfunda
          auscultacion: { fosaInguinal: { type: String } },
        },
      },
      lagartosIguanas: {
        piel: {
          inspeccionFrecuenciaTipoRespiracion: { type: String },
          presenciaHeridasAbscesosDisecdisis: { type: String },
          reflejoPaniculoCutaneo: { type: String },
        },
        cavidadCelomica: {
          palpacionProfunda: { type: String }, // Campo de tipo String para palpacionProfunda
          auscultacionAreaPulmonar: { type: String }, // FR - Auscultación del área pulmonar
          auscultacionAreaCardiaca: { type: String }, // FC - Auscultación del área cardíaca
        },
      },
      cloacaApendiceCaudal: {
        inspeccionPielApertura: { type: String },
        palpacion: { tonoMuscular: { type: String }, contenido: { type: String } },
      },
      sexaje: {
        inspeccion: {
          peneQuelonios: { type: String },
          hemipenesEscamados: { type: String },
        },
        coloracionMucosas: { type: String },
        apendiceCaudalCola: { estadoPielMovilidad: { type: String } },
      },
    },
  },
  fechaRevision: { 
    type: Date, 
    default: Date.now 
  },
  veterinario: { 
    type: String 
  },
  observacionesGenerales: { type: String },
  archivosAdjuntos: [{ type: String }],
});

const RevisionMedica = mongoose.model("RevisionMedica", revisionMedicaSchema);

module.exports = RevisionMedica;
