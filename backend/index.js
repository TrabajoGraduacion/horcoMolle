const express = require("express");
require("dotenv").config();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const connectDB = require("./database/db.js");
const authRoute = require("./routes/auth.routes.js");

// Importar las nuevas rutas
const animalRoutes = require("./routes/animal.routes");
const ingresoRoutes = require("./routes/ingreso.routes");
const recintoRoutes = require("./routes/recinto.routes");
const modificacionRecintoRoutes = require("./routes/modificacionRecinto.routes");
const relocalizacionRoutes = require("./routes/relocalizacion.routes");
const evaluacionRecintoRoutes = require("./routes/evaluacionRecinto.routes");
const dietaRoutes = require('./routes/dieta.routes');
const egresoRoutes = require("./routes/egreso.routes");
const observacionDiariaRoutes = require("./routes/observacionDiaria.routes");
const fichaClinicaRoutes = require("./routes/fichaClinica.routes");
const revisionMedicaRoutes = require("./routes/revisionMedica.routes");
const anestesiaRoutes = require("./routes/anestesia.routes");
const examenComplementarioRoutes = require("./routes/examenComplementario.routes");
const odontogramaRoutes = require("./routes/odontograma.routes");
const tratamientoRoutes = require("./routes/tratamiento.routes");
const necropsiaRoutes = require("./routes/necropsia.routes");
const evolucionRoutes = require('./routes/evolucion.routes');
const medidasMorfologicasRoutes = require('./routes/medidasMorfologicas.routes');
const diagnosticoRoutes = require('./routes/diagnostico.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const croquisRoutes = require('./routes/croquis.routes');
const enriquecimientoRoutes = require('./routes/enriquecimiento.routes');
const reportesRoutes = require('./routes/reportes.routes');

// Crear aplicación de backend
const app = express();
const PORT = process.env.PORT || 4500;

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.disable("x-powered-by");

// Directorio público
app.use(express.static("public"));

// Servir 'index.html' al acceder a la ruta raíz '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Agregar las nuevas rutas aquí
app.use("/api", authRoute);
app.use("/api/croquis", croquisRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/animales", animalRoutes);
app.use("/api/ingresos", ingresoRoutes);
app.use("/api/recintos", recintoRoutes);
app.use("/api/modificacion-recinto", modificacionRecintoRoutes);
app.use("/api/relocalizacion", relocalizacionRoutes);
app.use("/api/evaluacion-recinto", evaluacionRecintoRoutes);
app.use("/api/dietas", dietaRoutes);
app.use("/api/egresos", egresoRoutes);
app.use("/api/observaciones-diarias", observacionDiariaRoutes);
app.use("/api/fichaClinica", fichaClinicaRoutes);
app.use("/api/revision-medica", revisionMedicaRoutes);
app.use("/api/anestesia", anestesiaRoutes);
app.use("/api/examen-complementario", examenComplementarioRoutes);
app.use("/api/odontograma", odontogramaRoutes);
app.use("/api/tratamiento", tratamientoRoutes);
app.use("/api/necropsia", necropsiaRoutes);
app.use('/api/evolucion', evolucionRoutes);
app.use('/api/medidas-morfologicas', medidasMorfologicasRoutes);
app.use('/api/diagnostico', diagnosticoRoutes);
app.use('/api/enriquecimiento', enriquecimientoRoutes);
app.use('/api/reportes', reportesRoutes);

// Escucha del servidor
(async () => await connectDB())();

app.listen(PORT, () => {
  console.log(`Conectado al puerto ${PORT}`);
});
