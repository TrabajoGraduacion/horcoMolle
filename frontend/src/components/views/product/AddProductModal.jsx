import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const AddProductModal = ({ show, handleClose, handleAdd }) => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    // Campos de Animal
    nombreVulgar: '',
    nombreCientifico: '',
    pseudonimo: '',
    nombreInstitucional: '',
    chipNumero: '',
    anilloCaravanaIdentificacion: '',
    sexo: '', // Enum: ['Macho', 'Hembra', 'Indefinido']
    archivos: [],
    // Campos de Ingreso
    fechaIngreso: '',
    edadCategoria: '', // Enum: ['Cría', 'Juvenil', 'Subadulto', 'Adulto']
    edadExacta: { valor: '', unidad: '' }, // unidad: ['Meses', 'Años']
    estadoSalud: '',
    peso: '',
    medidasBiometricas: '',
    recintoId: '',
    condicionRecinto: '', // Enum: ['Cuarentena', 'Rehabilitación', 'Plantel Permanente', 'Internación Veterinaria', 'Presuelta', 'Tenencia Responsable']
    veterinario: '',
    motivoAtencionVeterinaria: '',
    condicionCautiverio: '',
    contactoVeterinario: '',
    alimentacionRecibida: '',
    fechaInicioCautiverio: '',
    donante: null,
    docenteAutorizaIngreso: '',
    notasAdicionales: '',
    // Campos adicionales del modelo Ingreso
    origen: '', // Enum: ['Rescate', 'Compra', 'Donación', 'Derivación', 'Decomiso']
    motivoRescate: '', // Enum: ['Ataque Animal', 'Ataque Humano', 'Acc. Auto', 'Acc. Doméstico', 'Fuera de hábitat', 'Decaído', 'Otro']
    historiaVida: '',
    infraccionNumero: '',
    autorizacionIntervencion: '',
    lugarObtencion: {
      lugar: '', // Enum: ['Hogar', 'Vía Pública', 'Establecimiento', 'Otro']
      direccion: '',
      localidad: '',
      provincia: ''
    }
  });

  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [recintos, setRecintos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const fileInputRef = useRef(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRecintos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}recintos`);
        setRecintos(response.data);
      } catch (error) {
        console.error('Error al obtener los recintos:', error);
      }
    };

    const fetchDocentes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}usuarios`);
        const docentesFiltrados = response.data.filter((usuario) => usuario.rol === 'Docente');
        setDocentes(docentesFiltrados);
      } catch (error) {
        console.error('Error al obtener los docentes:', error);
      }
    };

    fetchRecintos();
    fetchDocentes();
  }, []);

  // Función para manejar cambios generales en campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Función para manejar cambios en campos anidados
  const handleNestedChange = (field, e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], [name]: type === 'checkbox' ? checked : value },
    }));
  };

  const handleFileChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      console.log('Iniciando proceso de creación...');

      // Separar datos del animal y del ingreso
      const animalData = {
        nombreVulgar: formData.nombreVulgar,
        nombreCientifico: formData.nombreCientifico,
        pseudonimo: formData.pseudonimo,
        nombreInstitucional: formData.nombreInstitucional,
        chipNumero: formData.chipNumero,
        anilloCaravanaIdentificacion: formData.anilloCaravanaIdentificacion,
        sexo: formData.sexo
      };

      // Primero crear el animal
      console.log('Creando animal:', animalData);
      const animalResponse = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}animales`, 
        animalData
      );
      console.log('Animal creado:', animalResponse.data);

      // Subir imágenes a Cloudinary si hay alguna
      let archivosUrls = [];
      if (selectedImages.length > 0) {
        console.log('Subiendo imágenes...');
        const uploadPromises = Array.from(selectedImages).map(file => uploadFiles(file));
        archivosUrls = await Promise.all(uploadPromises);
        console.log('Imágenes subidas:', archivosUrls);
      }

      // Verificar si hay datos del donante
      const donanteData = Object.values(formData.donante || {}).some(value => value !== '' && value !== false)
        ? formData.donante
        : null;

      // Crear el ingreso asociado al animal
      const ingresoData = {
        animalId: animalResponse.data._id,
        fechaIngreso: formData.fechaIngreso,
        edadCategoria: formData.edadCategoria,
        edadExacta: formData.edadExacta,
        estadoSalud: formData.estadoSalud,
        peso: formData.peso,
        medidasBiometricas: formData.medidasBiometricas,
        recintoId: formData.recintoId,
        condicionRecinto: formData.condicionRecinto,
        veterinario: formData.veterinario,
        motivoAtencionVeterinaria: formData.motivoAtencionVeterinaria,
        condicionCautiverio: formData.condicionCautiverio,
        contactoVeterinario: formData.contactoVeterinario,
        alimentacionRecibida: formData.alimentacionRecibida,
        fechaInicioCautiverio: formData.fechaInicioCautiverio,
        donante: donanteData,
        docenteAutorizaIngreso: formData.docenteAutorizaIngreso,
        notasAdicionales: formData.notasAdicionales,
        origen: formData.origen,
        motivoRescate: formData.motivoRescate,
        historiaVida: formData.historiaVida,
        infraccionNumero: formData.infraccionNumero,
        autorizacionIntervencion: formData.autorizacionIntervencion,
        lugarObtencion: formData.lugarObtencion,
        archivos: archivosUrls
      };

      console.log('Creando ingreso:', ingresoData);
      const ingresoResponse = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}ingresos`,
        ingresoData
      );
      console.log('Ingreso creado:', ingresoResponse.data);

      // Actualizar la lista y cerrar el modal
      await handleAdd();
      handleClose();

      Swal.fire({
        title: '¡Éxito!',
        text: 'El animal y su ingreso han sido creados correctamente',
        icon: 'success',
        confirmButtonColor: '#70AA68',
        confirmButtonText: 'Aceptar'
      });

    } catch (error) {
      console.error('Error durante el proceso de creación:', error);
      
      // Si el animal se creó pero hubo error en el ingreso, eliminar el animal
      if (error.response?.data?.animalId) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_USUARIO}animales/${error.response.data.animalId}`);
        } catch (deleteError) {
          console.error('Error al revertir la creación del animal:', deleteError);
        }
      }

      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear el registro. Por favor, intente de nuevo.',
        icon: 'error',
        confirmButtonColor: '#70AA68',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadFiles = async (file) => {
    const uploadPreset = 'unsigned_preset'; // Tu upload preset de Cloudinary
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  // Agregar los estilos comunes
  const labelStyle = {
    color: '#333333',
    fontWeight: '500'
  };

  const inputStyle = {
    backgroundColor: '#D9EAD3',
    border: 'none',
    borderRadius: '4px',
    padding: '10px'
  };

  // Modificar el estado de selectedImages para usar con lightbox
  const lightboxImages = React.useMemo(() => 
    Array.from(selectedImages).map(file => ({
      src: URL.createObjectURL(file),
      alt: file.name
    })),
    [selectedImages]
  );

  // Agregar este useEffect para limpiar las URLs
  React.useEffect(() => {
    return () => {
      lightboxImages.forEach(image => URL.revokeObjectURL(image.src));
    };
  }, [lightboxImages]);

  // Agregar esta función para el lightbox
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const renderPage1 = () => (
    <Form>
      <h5 style={labelStyle}>Datos del Animal</h5>
      <Form.Group controlId="nombreVulgar" className="mb-3">
        <Form.Label style={labelStyle}>Nombre Vulgar</Form.Label>
        <Form.Control
          type="text"
          name="nombreVulgar"
          value={formData.nombreVulgar}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </Form.Group>

      <Form.Group controlId="nombreCientifico" className="mb-3">
        <Form.Label style={labelStyle}>Nombre Científico</Form.Label>
        <Form.Control 
          type="text" 
          name="nombreCientifico" 
          value={formData.nombreCientifico} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>

      <Form.Group controlId="pseudonimo" className="mb-3">
        <Form.Label style={labelStyle}>Pseudónimo</Form.Label>
        <Form.Control 
          type="text" 
          name="pseudonimo" 
          value={formData.pseudonimo} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="nombreInstitucional" className="mb-3">
        <Form.Label style={labelStyle}>Nombre Institucional</Form.Label>
        <Form.Control 
          type="text" 
          name="nombreInstitucional" 
          value={formData.nombreInstitucional} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="chipNumero" className="mb-3">
        <Form.Label style={labelStyle}>Número de Chip</Form.Label>
        <Form.Control 
          type="text" 
          name="chipNumero" 
          value={formData.chipNumero} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="anilloCaravanaIdentificacion" className="mb-3">
        <Form.Label style={labelStyle}>Anillo/Caravana de Identificación</Form.Label>
        <Form.Control 
          type="text" 
          name="anilloCaravanaIdentificacion" 
          value={formData.anilloCaravanaIdentificacion} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="sexo" className="mb-3">
        <Form.Label style={labelStyle}>Sexo</Form.Label>
        <Form.Control 
          as="select" 
          name="sexo" 
          value={formData.sexo} 
          onChange={handleChange} 
          required
        >
          <option value="">Seleccionar</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
          <option value="Indefinido">Indefinido</option>
        </Form.Control>
      </Form.Group>
    </Form>
  );

  const renderPage2 = () => (
    <Form>
      <h5 style={labelStyle}>Datos del Ingreso</h5>
      <Row>
        <Col md={12}>
          <Form.Group controlId="fechaIngreso" className="mb-3">
            <Form.Label style={labelStyle}>Fecha de Ingreso</Form.Label>
            <Form.Control 
              type="date" 
              name="fechaIngreso" 
              value={formData.fechaIngreso} 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="edadCategoria" className="mb-3">
            <Form.Label style={labelStyle}>Categoría de Edad</Form.Label>
            <Form.Control 
              as="select" 
              name="edadCategoria" 
              value={formData.edadCategoria} 
              onChange={handleChange} 
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="Cría">Cría</option>
              <option value="Juvenil">Juvenil</option>
              <option value="Subadulto">Subadulto</option>
              <option value="Adulto">Adulto</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="edadExacta" className="mb-3">
            <Form.Label style={labelStyle}>Edad Exacta</Form.Label>
            <Row>
              <Col md={6}>
                <Form.Control
                  type="number"
                  name="valor"
                  placeholder="Valor"
                  value={formData.edadExacta.valor}
                  onChange={(e) => handleNestedChange('edadExacta', e)}
                  style={inputStyle}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  as="select"
                  name="unidad"
                  value={formData.edadExacta.unidad}
                  onChange={(e) => handleNestedChange('edadExacta', e)}
                  style={inputStyle}
                >
                  <option value="">Seleccionar unidad</option>
                  <option value="Meses">Meses</option>
                  <option value="Años">Años</option>
                </Form.Control>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="estadoSalud" className="mb-3">
            <Form.Label style={labelStyle}>Estado de Salud</Form.Label>
            <Form.Control 
              type="text" 
              name="estadoSalud" 
              value={formData.estadoSalud} 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="peso" className="mb-3">
            <Form.Label style={labelStyle}>Peso (Kg)</Form.Label>
            <Form.Control 
              type="number" 
              name="peso" 
              value={formData.peso} 
              onChange={handleChange}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="medidasBiometricas" className="mb-3">
            <Form.Label style={labelStyle}>Medidas Biométricas</Form.Label>
            <Form.Control 
              as="textarea" 
              name="medidasBiometricas" 
              value={formData.medidasBiometricas} 
              onChange={handleChange}
              style={{...inputStyle, minHeight: '100px'}}
              placeholder="Ingrese las medidas biométricas del animal"
            />
          </Form.Group>

          <Form.Group controlId="recintoId" className="mb-3">
            <Form.Label style={labelStyle}>Recinto</Form.Label>
            <Form.Control 
              as="select" 
              name="recintoId" 
              value={formData.recintoId} 
              onChange={handleChange} 
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              {recintos.map((recinto) => (
                <option key={recinto._id} value={recinto._id}>
                  {recinto.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="condicionRecinto" className="mb-3">
            <Form.Label style={labelStyle}>Condición del Recinto</Form.Label>
            <Form.Control 
              as="select" 
              name="condicionRecinto" 
              value={formData.condicionRecinto} 
              onChange={handleChange} 
              required
              style={inputStyle}
            >
              <option value="">Seleccionar</option>
              <option value="Cuarentena">Cuarentena</option>
              <option value="Rehabilitación">Rehabilitación</option>
              <option value="Plantel Permanente">Plantel Permanente</option>
              <option value="Internación Veterinaria">Internación Veterinaria</option>
              <option value="Presuelta">Presuelta</option>
              <option value="Tenencia Responsable">Tenencia Responsable</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="docenteAutorizaIngreso" className="mb-3">
            <Form.Label style={labelStyle}>Docente que Autoriza el Ingreso</Form.Label>
            <Form.Control 
              as="select" 
              name="docenteAutorizaIngreso" 
              value={formData.docenteAutorizaIngreso} 
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Seleccionar Docente</option>
              {docentes.map((docente) => (
                <option key={docente._id} value={docente._id}>
                  {`${docente.nombre} ${docente.apellido}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="notasAdicionales" className="mb-3">
            <Form.Label style={labelStyle}>Notas Adicionales</Form.Label>
            <Form.Control 
              as="textarea" 
              name="notasAdicionales" 
              value={formData.notasAdicionales} 
              onChange={handleChange}
              style={{...inputStyle, minHeight: '100px'}}
              placeholder="Ingrese notas adicionales sobre el ingreso"
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );

  const renderPage3 = () => (
    <Form>
      <h5 style={labelStyle}>Datos del Rescate y Lugar de Obtención</h5>
      
      <Form.Group controlId="origen" className="mb-3">
        <Form.Label style={labelStyle}>Origen</Form.Label>
        <Form.Control 
          as="select" 
          name="origen" 
          value={formData.origen} 
          onChange={handleChange} 
          required
        >
          <option value="">Seleccionar</option>
          <option value="Rescate">Rescate</option>
          <option value="Compra">Compra</option>
          <option value="Donación">Donación</option>
          <option value="Derivación">Derivación</option>
          <option value="Decomiso">Decomiso</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="motivoRescate" className="mb-3">
        <Form.Label style={labelStyle}>Motivo del Rescate</Form.Label>
        <Form.Control 
          as="select" 
          name="motivoRescate" 
          value={formData.motivoRescate} 
          onChange={handleChange} 
          required
        >
          <option value="">Seleccionar</option>
          <option value="Ataque Animal">Ataque Animal</option>
          <option value="Ataque Humano">Ataque Humano</option>
          <option value="Acc. Auto">Acc. Auto</option>
          <option value="Acc. Doméstico">Acc. Domstico</option>
          <option value="Fuera de hábitat">Fuera de hábitat</option>
          <option value="Decaído">Decaído</option>
          <option value="Otro">Otro</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="historiaVida" className="mb-3">
        <Form.Label style={labelStyle}>Historia del Animal</Form.Label>
        <Form.Control 
          as="textarea" 
          name="historiaVida" 
          value={formData.historiaVida} 
          onChange={handleChange}
          style={{ minHeight: '100px' }}
        />
      </Form.Group>

      <Form.Group controlId="infraccionNumero" className="mb-3">
        <Form.Label style={labelStyle}>Número de Infracción</Form.Label>
        <Form.Control 
          type="text" 
          name="infraccionNumero" 
          value={formData.infraccionNumero} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="autorizacionIntervencion" className="mb-3">
        <Form.Label style={labelStyle}>Autorización de Intervención</Form.Label>
        <Form.Control 
          type="text" 
          name="autorizacionIntervencion" 
          value={formData.autorizacionIntervencion} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="lugarObtencionLugar" className="mb-3">
        <Form.Label style={labelStyle}>Lugar de Obtención</Form.Label>
        <Form.Control 
          as="select" 
          name="lugar" 
          value={formData.lugarObtencion.lugar} 
          onChange={(e) => handleNestedChange('lugarObtencion', e)} 
          required
        >
          <option value="">Seleccionar</option>
          <option value="Hogar">Hogar</option>
          <option value="Vía Pública">Vía Pública</option>
          <option value="Establecimiento">Establecimiento</option>
          <option value="Otro">Otro</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="lugarObtencionDireccion" className="mb-3">
        <Form.Label style={labelStyle}>Dirección</Form.Label>
        <Form.Control 
          type="text" 
          name="direccion" 
          value={formData.lugarObtencion.direccion} 
          onChange={(e) => handleNestedChange('lugarObtencion', e)} 
        />
      </Form.Group>

      <Form.Group controlId="lugarObtencionLocalidad" className="mb-3">
        <Form.Label style={labelStyle}>Localidad</Form.Label>
        <Form.Control 
          type="text" 
          name="localidad" 
          value={formData.lugarObtencion.localidad} 
          onChange={(e) => handleNestedChange('lugarObtencion', e)} 
        />
      </Form.Group>

      <Form.Group controlId="lugarObtencionProvincia" className="mb-3">
        <Form.Label style={labelStyle}>Provincia</Form.Label>
        <Form.Control 
          type="text" 
          name="provincia" 
          value={formData.lugarObtencion.provincia} 
          onChange={(e) => handleNestedChange('lugarObtencion', e)} 
        />
      </Form.Group>
    </Form>
  );

  const renderPage4 = () => (
    <Form>
      <h5 style={labelStyle}>Información de Cautiverio</h5>
      
      <Form.Group controlId="fechaInicioCautiverio" className="mb-3">
        <Form.Label style={labelStyle}>Fecha de Inicio del Cautiverio</Form.Label>
        <Form.Control 
          type="date" 
          name="fechaInicioCautiverio" 
          value={formData.fechaInicioCautiverio} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="tiempoCautiverio" className="mb-3">
        <Form.Label style={labelStyle}>Tiempo de Cautiverio</Form.Label>
        <Form.Control 
          type="text" 
          name="tiempoCautiverio" 
          value={formData.tiempoCautiverio} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="alimentacionRecibida" className="mb-3">
        <Form.Label style={labelStyle}>Alimentación Recibida</Form.Label>
        <Form.Control 
          type="text" 
          name="alimentacionRecibida" 
          value={formData.alimentacionRecibida} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="condicionCautiverio" className="mb-3">
        <Form.Label style={labelStyle}>Condición durante el Cautiverio</Form.Label>
        <Form.Control 
          type="text" 
          name="condicionCautiverio" 
          value={formData.condicionCautiverio} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="motivoAtencionVeterinaria" className="mb-3">
        <Form.Label style={labelStyle}>Motivo de Atención Veterinaria</Form.Label>
        <Form.Control 
          type="text" 
          name="motivoAtencionVeterinaria" 
          value={formData.motivoAtencionVeterinaria} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="veterinario" className="mb-3">
        <Form.Label style={labelStyle}>Veterinario</Form.Label>
        <Form.Control 
          type="text" 
          name="veterinario" 
          value={formData.veterinario} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="contactoVeterinario" className="mb-3">
        <Form.Label style={labelStyle}>Contacto del Veterinario</Form.Label>
        <Form.Control 
          type="text" 
          name="contactoVeterinario" 
          value={formData.contactoVeterinario} 
          onChange={handleChange} 
        />
      </Form.Group>

      <Form.Group controlId="observacionesVeterinarias" className="mb-3">
        <Form.Label style={labelStyle}>Observaciones Veterinarias</Form.Label>
        <Form.Control 
          as="textarea" 
          name="observacionesVeterinarias" 
          value={formData.observacionesVeterinarias} 
          onChange={handleChange}
          style={{ minHeight: '100px' }}
        />
      </Form.Group>
    </Form>
  );

  const renderPage5 = () => (
    <Form>
      <h5 style={labelStyle}>Datos del Donante</h5>
      <Row>
        <Col md={12}>
          <Form.Group controlId="donanteApellido" className="mb-3">
            <Form.Label style={labelStyle}>Apellido</Form.Label>
            <Form.Control 
              type="text" 
              name="apellido" 
              value={formData.donante?.apellido || ''} 
              onChange={(e) => handleNestedChange('donante', e)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="donanteNombre" className="mb-3">
            <Form.Label style={labelStyle}>Nombre</Form.Label>
            <Form.Control 
              type="text" 
              name="nombre" 
              value={formData.donante?.nombre || ''} 
              onChange={(e) => handleNestedChange('donante', e)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="donanteDni" className="mb-3">
            <Form.Label style={labelStyle}>DNI</Form.Label>
            <Form.Control 
              type="text" 
              name="dni" 
              value={formData.donante?.dni || ''} 
              onChange={(e) => handleNestedChange('donante', e)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="donanteDomicilio" className="mb-3">
            <Form.Label style={labelStyle}>Domicilio</Form.Label>
            <Form.Control 
              type="text" 
              name="domicilio" 
              value={formData.donante?.domicilio || ''} 
              onChange={(e) => handleNestedChange('donante', e)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="donanteLocalidad" className="mb-3">
            <Form.Label style={labelStyle}>Localidad</Form.Label>
            <Form.Control 
              type="text" 
              name="localidad" 
              value={formData.donante?.localidad || ''} 
              onChange={(e) => handleNestedChange('donante', e)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="donanteProvincia" className="mb-3">
            <Form.Label style={labelStyle}>Provincia</Form.Label>
            <Form.Control 
              type="text" 
              name="provincia" 
              value={formData.donante?.provincia || ''} 
              onChange={(e) => handleNestedChange('donante', e)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="donanteTelefono" className="mb-3">
            <Form.Label style={labelStyle}>Teléfono</Form.Label>
            <Form.Control 
              type="text" 
              name="telefono" 
              value={formData.donante?.telefono || ''} 
              onChange={(e) => handleNestedChange('donante', e)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="donanteEmail" className="mb-3">
            <Form.Label style={labelStyle}>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              value={formData.donante?.email || ''} 
              onChange={(e) => handleNestedChange('donante', e)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group controlId="donanteContactoFauna" className="mb-3">
            <Form.Label style={labelStyle}>¿Se contactó con Fauna?</Form.Label>
            <Form.Control
              as="select"
              name="contactoFauna"
              value={formData.donante?.contactoFauna ? 'true' : 'false'}
              onChange={(e) => handleNestedChange('donante', {
                target: {
                  name: 'contactoFauna',
                  value: e.target.value === 'true'
                }
              })}
              style={inputStyle}
            >
              <option value="false">No</option>
              <option value="true">Sí</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );

  const renderPage6 = () => (
    <>
      <div className="text-center mb-4">
        <h4 style={{ fontSize: '24px', color: '#333' }}>
          Fotos del Animal
        </h4>
      </div>

      <Form.Group className="mt-2">
        <div 
          style={{
            border: '2px dashed #70AA68',
            borderRadius: '8px',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            backgroundColor: '#f8f9fa'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ marginBottom: '10px' }}>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '48px', color: '#70AA68' }}></i>
          </div>

          <div style={{ color: '#70AA68', fontSize: '16px', marginBottom: '8px' }}>
            Haga clic o arrastre las fotos aquí
          </div>

          <div style={{ color: '#666', fontSize: '14px' }}>
            Formatos permitidos: JPG, PNG, GIF
          </div>

          <Form.Control
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {selectedImages.length > 0 && (
          <div className="mt-3">
            <h5 style={{ color: '#333' }}>Vista previa:</h5>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px',
              marginTop: '10px' 
            }}>
              {lightboxImages.map((image, index) => (
                <div 
                  key={index}
                  style={{
                    position: 'relative',
                    width: '150px',
                    height: '150px'
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onClick={() => openLightbox(index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newFiles = Array.from(selectedImages).filter((_, i) => i !== index);
                      const dataTransfer = new DataTransfer();
                      newFiles.forEach(file => dataTransfer.items.add(file));
                      setSelectedImages(dataTransfer.files);
                    }}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: 'rgba(255, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 1
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Form.Group>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={currentImageIndex}
        slides={lightboxImages}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
        }}
      />
    </>
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Animal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {page === 1 && renderPage1()}
        {page === 2 && renderPage2()}
        {page === 3 && renderPage3()}
        {page === 4 && renderPage4()}
        {page === 5 && renderPage5()}
        {page === 6 && renderPage6()}

        <div className="d-flex justify-content-between mt-4">
          {page === 1 ? (
            <Button 
              variant="outline-danger" 
              onClick={handleClose}
              style={{
                backgroundColor: 'white',
                borderColor: '#dc3545',
                color: '#dc3545',
                borderRadius: '8px',
                padding: '8px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff1f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <i className="fas fa-times"></i> Cancelar
            </Button>
          ) : (
            <Button 
              variant="outline-secondary" 
              onClick={handlePrevious}
              style={{
                backgroundColor: 'white',
                borderColor: '#6c757d',
                color: '#6c757d',
                borderRadius: '8px',
                padding: '8px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <i className="fas fa-arrow-left"></i> Anterior
            </Button>
          )}
          
          <Button 
            variant="success" 
            onClick={page === 6 ? handleSubmit : handleNext}
            disabled={uploading}
            style={{
              backgroundColor: '#70AA68',
              borderColor: '#70AA68',
              borderRadius: '8px',
              padding: '8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5C8F55';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#70AA68';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {page === 6 ? (
              <>Guardar</>
            ) : (
              <>Siguiente <i className="fas fa-arrow-right"></i></>
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;