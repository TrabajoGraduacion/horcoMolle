const Ingreso = require('../models/ingreso.model');
const Evolucion = require('../models/evolucion.model');
const ModificacionRecinto = require('../models/modificacionRecinto.model');
const Relocalizacion = require('../models/relocalizacion.model');
const EvaluacionRecinto = require('../models/evaluacionRecinto.model');
const Egreso = require('../models/egreso.model');
const ObservacionDiaria = require('../models/observacionDiaria.model');
const Enriquecimiento = require('../models/enriquecimiento.model');
const FichaClinica = require('../models/fichaClinica.model');
const RevisionMedica = require('../models/revisionMedica.model');
const Anestesia = require('../models/anestesia.model');
const ExamenComplementario = require('../models/examenComplementario.model');
const Tratamiento = require('../models/tratamiento.model');
const Necropsia = require('../models/necropsia.model');
const MedidasMorfologicas = require('../models/medidasMorfologicas.model');
const Dieta = require('../models/dieta.model');


const obtenerEventosRecintos = async (req, res) => {
  try {
    const [ingresos, evoluciones, modificaciones, relocalizaciones, 
      evaluaciones, egresos, observaciones, enriquecimientos,
      fichasClinicas, revisionesMedicas, anestesias, 
      examenesComplementarios, tratamientos, necropsias,
      medidasMorfologicas, dietas] = await Promise.all([
 // Eventos de recintos
 Ingreso.find()
   .populate('recintoId', 'nombre', null, { strictPopulate: false })
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 Evolucion.find(),
 ModificacionRecinto.find()
   .populate('recintoId', 'nombre', null, { strictPopulate: false }),
 Relocalizacion.find()
   .populate('recintoId', 'nombre', null, { strictPopulate: false }),
 EvaluacionRecinto.find()
   .populate('recintoId', 'nombre', null, { strictPopulate: false }),
 Egreso.find()
   .populate('recintoId', 'nombre', null, { strictPopulate: false })
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 ObservacionDiaria.find()
   .populate('recintoId', 'nombre', null, { strictPopulate: false })
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 Enriquecimiento.find()
   .populate('recintoId', 'nombre', null, { strictPopulate: false }),
 
 // Eventos médicos/clínicos
 FichaClinica.find()
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 RevisionMedica.find()
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 Anestesia.find()
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 ExamenComplementario.find()
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 Tratamiento.find()
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 Necropsia.find()
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 MedidasMorfologicas.find()
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
 Dieta.find()  
   .populate('animalId', 'nombreInstitucional', null, { strictPopulate: false }),
   
]);
  
const todosLosEventos = [
  // Eventos de recintos
  ...ingresos.map(i => {
    const evento = {
      id: i._id,
      tipo: 'Ingreso',
      fecha: i.fechaIngreso
    };
    if (i.recintoId) {
      evento.recintoId = i.recintoId._id;
      evento.nombreRecinto = i.recintoId.nombre;
    }
    if (i.animalId) {
      evento.animalId = i.animalId._id;
      evento.nombreAnimal = i.animalId.nombreInstitucional;
    }
    return evento;
  }),

  ...evoluciones.map(e => ({ 
    id: e._id,
    tipo: 'Evolución', 
    fecha: e.fecha 
  })),

  ...modificaciones.map(m => {
    const evento = {
      id: m._id,
      tipo: 'Modificación Recinto',
      fecha: m.creadoEn
    };
    if (m.recintoId) {
      evento.recintoId = m.recintoId._id;
      evento.nombreRecinto = m.recintoId.nombre;
    }
    return evento;
  }),

  ...relocalizaciones.map(r => {
    const evento = {
      id: r._id,
      tipo: 'Relocalización',
      fecha: r.fecha
    };
    if (r.recintoId) {
      evento.recintoId = r.recintoId._id;
      evento.nombreRecinto = r.recintoId.nombre;
    }
    return evento;
  }),

  ...evaluaciones.map(e => {
    const evento = {
      id: e._id,
      tipo: 'Evaluación Recinto',
      fecha: e.fechaEvaluacion
    };
    if (e.recintoId) {
      evento.recintoId = e.recintoId._id;
      evento.nombreRecinto = e.recintoId.nombre;
    }
    return evento;
  }),

  ...egresos.map(e => {
    const evento = {
      id: e._id,
      tipo: 'Egreso',
      fecha: e.fecha
    };
    if (e.recintoId) {
      evento.recintoId = e.recintoId._id;
      evento.nombreRecinto = e.recintoId.nombre;
    }
    if (e.animalId) {
      evento.animalId = e.animalId._id;
      evento.nombreAnimal = e.animalId.nombreInstitucional;
    }
    return evento;
  }),

  ...observaciones.map(o => {
    const evento = {
      id: o._id,
      tipo: 'Observación Diaria',
      fecha: o.fecha
    };
    if (o.recintoId) {
      evento.recintoId = o.recintoId._id;
      evento.nombreRecinto = o.recintoId.nombre;
    }
    if (o.animalId) {
      evento.animalId = o.animalId._id;
      evento.nombreAnimal = o.animalId.nombreInstitucional;
    }
    return evento;
  }),

  ...enriquecimientos.map(e => {
    const evento = {
      id: e._id,
      tipo: 'Enriquecimiento',
      fecha: e.fecha
    };
    if (e.recintoId) {
      evento.recintoId = e.recintoId._id;
      evento.nombreRecinto = e.recintoId.nombre;
    }
    return evento;
  }),

  // Eventos médicos/clínicos
  ...fichasClinicas.map(f => {
    const evento = {
      id: f._id,
      tipo: 'Ficha Clínica',
      fecha: f.creadoEn
    };
    if (f.animalId) {
      evento.animalId = f.animalId._id;
      evento.nombreAnimal = f.animalId.nombreInstitucional;
    }
    return evento;
  }),

  ...revisionesMedicas.map(r => {
    const evento = {
      id: r._id,
      tipo: 'Revisión Médica',
      fecha: r.fecha
    };
    if (r.animalId) {
      evento.animalId = r.animalId._id;
      evento.nombreAnimal = r.animalId.nombreInstitucional;
    }
    return evento;
  }),

  ...anestesias.map(a => {
    const evento = {
      id: a._id,
      tipo: 'Anestesia',
      fecha: a.fecha
    };
    if (a.animalId) {
      evento.animalId = a.animalId._id;
      evento.nombreAnimal = a.animalId.nombreInstitucional;
    }
    return evento;
  }),

  ...examenesComplementarios.map(e => {
    const evento = {
      id: e._id,
      tipo: 'Examen Complementario',
      fecha: e.fecha
    };
    if (e.animalId) {
      evento.animalId = e.animalId._id;
      evento.nombreAnimal = e.animalId.nombreInstitucional;
    }
    return evento;
  }),

  ...tratamientos.map(t => {
    const evento = {
      id: t._id,
      tipo: 'Tratamiento',
      fecha: t.fecha
    };
    if (t.animalId) {
      evento.animalId = t.animalId._id;
      evento.nombreAnimal = t.animalId.nombreInstitucional;
    }
    return evento;
  }),

  ...necropsias.map(n => {
    const evento = {
      id: n._id,
      tipo: 'Necropsia',
      fecha: n.fecha
    };
    if (n.animalId) {
      evento.animalId = n.animalId._id;
      evento.nombreAnimal = n.animalId.nombreInstitucional;
    }
    return evento;
  }),

  ...medidasMorfologicas.map(m => {
    const evento = {
      id: m._id,
      tipo: 'Medidas Morfológicas',
      fecha: m.fecha
    };
    if (m.animalId) {
      evento.animalId = m.animalId._id;
      evento.nombreAnimal = m.animalId.nombreInstitucional;
    }
    return evento;
  }),


  ...dietas.map(d => {
    const evento = {
      id: d._id,
      tipo: 'Dieta',
      fecha: d.fechaInicio
    };
    if (d.animalId) {
      evento.animalId = d.animalId._id;
      evento.nombreAnimal = d.animalId.nombreInstitucional;
    }
    return evento;
  }),
];
  
      // Ordenar todos los eventos por fecha (más recientes primero)
      todosLosEventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
      res.status(200).json(todosLosEventos);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error al obtener los eventos', 
        error: error.message 
      });
    }
  };

const obtenerEventosPorMes = async (req, res) => {
  try {
    const [ingresos, evoluciones, modificaciones, relocalizaciones, 
      evaluaciones, egresos, observaciones, enriquecimientos,
      fichasClinicas, revisionesMedicas, anestesias, 
      examenesComplementarios, tratamientos, necropsias,
      medidasMorfologicas, dietas] = await Promise.all([
      // Eventos de recintos
      Ingreso.find(),
      Evolucion.find(),
      ModificacionRecinto.find(),
      Relocalizacion.find(),
      EvaluacionRecinto.find(),
      Egreso.find(),
      ObservacionDiaria.find(),
      Enriquecimiento.find(),
      // Eventos médicos/clínicos
      FichaClinica.find(),
      RevisionMedica.find(),
      Anestesia.find(),
      ExamenComplementario.find(),
      Tratamiento.find(),
      Necropsia.find(),
      MedidasMorfologicas.find(),
      Dieta.find()
    ]);

    const todosLosEventos = [
      ...ingresos.map(i => ({ tipo: 'Ingreso', fecha: i.fechaIngreso })),
      ...evoluciones.map(e => ({ tipo: 'Evolución', fecha: e.fecha })),
      ...modificaciones.map(m => ({ 
        tipo: 'Modificación Recinto', 
        fecha: m.creadoEn
      })),
      ...relocalizaciones.map(r => ({ tipo: 'Relocalización', fecha: r.fecha })),
      ...evaluaciones.map(e => ({ 
        tipo: 'Evaluación Recinto', 
        fecha: e.fechaEvaluacion
      })),
      ...egresos.map(e => ({ tipo: 'Egreso', fecha: e.fecha })),
      ...observaciones.map(o => ({ tipo: 'Observación Diaria', fecha: o.fecha })),
      ...enriquecimientos.map(e => ({ tipo: 'Enriquecimiento', fecha: e.fecha })),
      ...fichasClinicas.map(f => ({ tipo: 'Ficha Clínica', fecha: f.creadoEn })),
      ...revisionesMedicas.map(r => ({ tipo: 'Revisión Médica', fecha: r.fecha })),
      ...anestesias.map(a => ({ tipo: 'Anestesia', fecha: a.fecha })),
      ...examenesComplementarios.map(e => ({ tipo: 'Examen Complementario', fecha: e.fecha })),
      ...tratamientos.map(t => ({ tipo: 'Tratamiento', fecha: t.fecha })),
      ...necropsias.map(n => ({ tipo: 'Necropsia', fecha: n.fecha })),
      ...medidasMorfologicas.map(m => ({ tipo: 'Medidas Morfológicas', fecha: m.fecha })),
      ...dietas.map(d => ({ tipo: 'Dieta', fecha: d.fechaInicio }))
    ];

    // Agrupar eventos por mes/año y tipo
    const eventosPorMes = todosLosEventos.reduce((acc, evento) => {
      const fecha = new Date(evento.fecha);
      const mesAno = `${String(fecha.getMonth() + 1).padStart(2, '0')}/${fecha.getFullYear()}`;
      
      if (!acc[mesAno]) {
        acc[mesAno] = {};
      }
      
      if (!acc[mesAno][evento.tipo]) {
        acc[mesAno][evento.tipo] = 0;
      }
      
      acc[mesAno][evento.tipo]++;
      return acc;
    }, {});

    // Ordenar las fechas de más reciente a más antigua
    const eventosPorMesOrdenados = Object.entries(eventosPorMes)
      .sort((a, b) => {
        const [mesAnoA] = a[0].split('/');
        const [mesAnoB] = b[0].split('/');
        return new Date(mesAnoB) - new Date(mesAnoA);
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    res.status(200).json(eventosPorMesOrdenados);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener los eventos por mes', 
      error: error.message 
    });
  }
};

module.exports = {
  obtenerEventosRecintos,
  obtenerEventosPorMes
};