import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const EditProductModal = ({ show, handleClose, handleEdit, animalToEdit }) => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    // Inicializa todos los campos aquí con valores por defecto
    nombreVulgar: '',
    nombreCientifico: '',
    pseudonimo: '',
    nombreInstitucional: '',
    chipNumero: '',
    anilloCaravanaIdentificacion: '',
    sexo: '',
    archivos: [],
    fechaIngreso: '',
    edadCategoria: '',
    edadExacta: { valor: '', unidad: '' },
    estadoSalud: '',
    peso: '',
    medidasBiometricas: '',
    recintoId: '',
    condicionRecinto: '',
    veterinario: '',
    motivoAtencionVeterinaria: '',
    condicionCautiverio: '',
    contactoVeterinario: '',
    alimentacionRecibida: '',
    fechaInicioCautiverio: '',
    donante: {
      apellido: '',
      nombre: '',
      dni: '',
      domicilio: '',
      localidad: '',
      provincia: '',
      telefono: '',
      email: '',
      contactoFauna: false,
    },
    docenteAutorizaIngreso: '',
    notasAdicionales: '',
    origen: '',
    motivoRescate: '',
    historiaVida: '',
    infraccionNumero: '',
    autorizacionIntervencion: '',
    lugarObtencion: {
      lugar: '',
      direccion: '',
      localidad: '',
      provincia: ''
    }
  });

  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [recintos, setRecintos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    if (show && animalToEdit) {
      fetchAnimalAndIngreso();
      fetchRecintos();
      fetchDocentes();
    }
  }, [show, animalToEdit]);

  useEffect(() => {
    if (animalToEdit) {
      setFormData(prevState => ({
        ...prevState,
        ...animalToEdit,
        peso: animalToEdit.peso && animalToEdit.peso.$numberDecimal ? animalToEdit.peso.$numberDecimal : '',
        fechaIngreso: animalToEdit.fechaIngreso ? formatDateForInput(animalToEdit.fechaIngreso) : '',
        fechaInicioCautiverio: animalToEdit.fechaInicioCautiverio ? formatDateForInput(animalToEdit.fechaInicioCautiverio) : '',
        // ... otros campos ...
      }));
    }
  }, [animalToEdit]);

  const fetchAnimalAndIngreso = async () => {
    try {
      // Obtener todos los ingresos
      const ingresosResponse = await axios.get(`${import.meta.env.VITE_API_USUARIO}ingresos`);
      const ingresos = ingresosResponse.data;

      // Buscar el ingreso correspondiente al animal
      const ingreso = ingresos.find(ing => ing.animalId === animalToEdit._id);

      if (!ingreso) {
        console.warn('No se encontró un ingreso para este animal');
      }

      // Combinar datos del animal e ingreso
      const combinedData = {
        ...animalToEdit,
        ...(ingreso || {}),
        peso: ingreso && ingreso.peso && ingreso.peso.$numberDecimal ? ingreso.peso.$numberDecimal : '',
        fechaIngreso: ingreso && ingreso.fechaIngreso ? formatDateForInput(ingreso.fechaIngreso) : '',
        fechaInicioCautiverio: ingreso && ingreso.fechaInicioCautiverio ? formatDateForInput(ingreso.fechaInicioCautiverio) : '',
        edadExacta: (ingreso && ingreso.edadExacta) || { valor: '', unidad: '' },
        donante: (ingreso && ingreso.donante) || {
          apellido: '', nombre: '', dni: '', domicilio: '', localidad: '',
          provincia: '', telefono: '', email: '', contactoFauna: false,
        },
      };

      console.log('Datos combinados:', combinedData); // Para depuración

      setFormData(combinedData);
      setSelectedImages(animalToEdit.archivos || []);

    } catch (error) {
      console.error('Error al obtener los datos del animal e ingreso:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos del animal e ingreso',
      });
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

  const uploadImagesToCloudinary = async () => {
    const urls = [];
    const uploadPreset = 'unsigned_preset'; 
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 

    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        urls.push(data.secure_url);
      } catch (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        throw error;
      }
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrls = formData.archivos || [];

      // Subir nuevas imágenes si las hay
      if (selectedImages.length > 0) {
        const newUrls = await uploadImagesToCloudinary();
        imageUrls = [...imageUrls, ...newUrls];
      }

      // Eliminar imágenes marcadas para eliminación
      imageUrls = imageUrls.filter(url => !deletedImages.includes(url));

      // Separar los datos para el animal y el ingreso
      const animalData = {
        nombreVulgar: formData.nombreVulgar,
        nombreCientifico: formData.nombreCientifico,
        pseudonimo: formData.pseudonimo,
        nombreInstitucional: formData.nombreInstitucional,
        chipNumero: formData.chipNumero,
        anilloCaravanaIdentificacion: formData.anilloCaravanaIdentificacion,
        sexo: formData.sexo,
        // Otros campos específicos del animal...
      };

      const ingresoData = {
        animalId: animalToEdit._id,
        fechaIngreso: formData.fechaIngreso,
        edadCategoria: formData.edadCategoria,
        edadExacta: {
          valor: formData.edadExacta.valor ? parseInt(formData.edadExacta.valor) : '',
          unidad: formData.edadExacta.unidad
        },
        estadoSalud: formData.estadoSalud,
        peso: parseFloat(formData.peso) || 0,
        medidasBiometricas: formData.medidasBiometricas,
        recintoId: formData.recintoId,
        condicionRecinto: formData.condicionRecinto,
        veterinario: formData.veterinario,
        motivoAtencionVeterinaria: formData.motivoAtencionVeterinaria,
        condicionCautiverio: formData.condicionCautiverio,
        contactoVeterinario: formData.contactoVeterinario,
        alimentacionRecibida: formData.alimentacionRecibida,
        fechaInicioCautiverio: formData.fechaInicioCautiverio,
        donante: formData.donante,
        origen: formData.origen,
        motivoRescate: formData.motivoRescate,
        historiaVida: formData.historiaVida,
        infraccionNumero: formData.infraccionNumero,
        autorizacionIntervencion: formData.autorizacionIntervencion,
        lugarObtencion: formData.lugarObtencion,
        docenteAutorizaIngreso: formData.docenteAutorizaIngreso,
        notasAdicionales: formData.notasAdicionales,
        archivos: imageUrls, // Ahora los archivos se guardan en el ingreso
      };

      // Actualizar el animal
      const animalResponse = await axios.put(`${import.meta.env.VITE_API_USUARIO}animales/${animalToEdit._id}`, animalData);

      // Obtener todos los ingresos
      const ingresosResponse = await axios.get(`${import.meta.env.VITE_API_USUARIO}ingresos`);
      const ingresos = ingresosResponse.data;

      // Buscar el ingreso correspondiente al animal
      const ingreso = ingresos.find(ing => ing.animalId === animalToEdit._id);

      if (!ingreso) {
        throw new Error('No se encontró un ingreso para este animal');
      }

      // Actualizar el ingreso
      const ingresoResponse = await axios.put(`${import.meta.env.VITE_API_USUARIO}ingresos/${ingreso._id}`, ingresoData);

      if (animalResponse.status === 200 && ingresoResponse.status === 200) {
        handleEdit({ ...animalResponse.data, ...ingresoResponse.data });
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El animal y el ingreso han sido actualizados correctamente',
        });
        handleClose();
      }
    } catch (error) {
      console.error('Error al actualizar el animal y el ingreso:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el animal y el ingreso',
      });
    } finally {
      setUploading(false);
    }
  };

  const renderPage1 = () => (
    <Form>
      <h5>Datos del Animal</h5>
      <Row>
        <Col md={6}>
          <Form.Group controlId="nombreVulgar">
            <Form.Label>Nombre Vulgar</Form.Label>
            <Form.Control type="text" name="nombreVulgar" value={formData.nombreVulgar} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="nombreCientifico" className="mt-3">
            <Form.Label>Nombre Científico</Form.Label>
            <Form.Control type="text" name="nombreCientifico" value={formData.nombreCientifico} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="pseudonimo" className="mt-3">
            <Form.Label>Pseudónimo</Form.Label>
            <Form.Control type="text" name="pseudonimo" value={formData.pseudonimo} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="nombreInstitucional" className="mt-3">
            <Form.Label>Nombre Institucional</Form.Label>
            <Form.Control type="text" name="nombreInstitucional" value={formData.nombreInstitucional} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="chipNumero" className="mt-3">
            <Form.Label>Número de Chip</Form.Label>
            <Form.Control type="text" name="chipNumero" value={formData.chipNumero} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="anilloCaravanaIdentificacion" className="mt-3">
            <Form.Label>Anillo/Caravana de Identificación</Form.Label>
            <Form.Control type="text" name="anilloCaravanaIdentificacion" value={formData.anilloCaravanaIdentificacion} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="sexo" className="mt-3">
            <Form.Label>Sexo</Form.Label>
            <Form.Control as="select" name="sexo" value={formData.sexo} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
              <option value="Indefinido">Indefinido</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mt-4">
        <Form.Label>Fotos del Animal</Form.Label>
        {formData.archivos && formData.archivos.length > 0 && (
          <div className="d-flex flex-wrap">
            {formData.archivos.map((foto, index) => (
              <Card key={index} className="m-2" style={{ width: '150px' }}>
                <Image
                  src={foto}
                  alt={`Foto ${index + 1}`}
                  thumbnail
                  style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleImageDelete(foto)}
                >
                  Eliminar
                </Button>
              </Card>
            ))}
          </div>
        )}
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
      </Form.Group>
    </Form>
  );

  const handleImageDelete = (url) => {
    setFormData(prevState => ({
      ...prevState,
      archivos: prevState.archivos.filter(foto => foto !== url)
    }));
    setDeletedImages(prevDeleted => [...prevDeleted, url]);
  };

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const renderPage2 = () => (
    <Form>
      <h5>Datos del Ingreso</h5>
      <Row>
        <Col md={6}>
          <Form.Group controlId="fechaIngreso">
            <Form.Label>Fecha de Ingreso</Form.Label>
            <Form.Control type="date" name="fechaIngreso" value={formData.fechaIngreso} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="edadCategoria" className="mt-3">
            <Form.Label>Categoría de Edad</Form.Label>
            <Form.Control as="select" name="edadCategoria" value={formData.edadCategoria} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Cría">Cría</option>
              <option value="Juvenil">Juvenil</option>
              <option value="Subadulto">Subadulto</option>
              <option value="Adulto">Adulto</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="edadExactaValor" className="mt-3">
            <Form.Label>Edad Exacta</Form.Label>
            <Row>
              <Col md={6}>
                <Form.Control 
                  type="number" 
                  name="valor" 
                  value={formData.edadExacta?.valor || ''} 
                  onChange={(e) => handleNestedChange('edadExacta', e)} 
                />
              </Col>
              <Col md={6}>
                <Form.Control 
                  as="select" 
                  name="unidad" 
                  value={formData.edadExacta?.unidad || ''} 
                  onChange={(e) => handleNestedChange('edadExacta', e)} 
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Meses">Meses</option>
                  <option value="Años">Años</option>
                </Form.Control>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="estadoSalud" className="mt-3">
            <Form.Label>Estado de Salud</Form.Label>
            <Form.Control type="text" name="estadoSalud" value={formData.estadoSalud} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="peso">
            <Form.Label>Peso</Form.Label>
            <Form.Control 
              type="number" 
              step="0.01"
              name="peso" 
              value={formData.peso} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group controlId="medidasBiometricas" className="mt-3">
            <Form.Label>Medidas Biométricas</Form.Label>
            <Form.Control type="text" name="medidasBiometricas" value={formData.medidasBiometricas} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="recintoId" className="mt-3">
            <Form.Label>Recinto</Form.Label>
            <Form.Control as="select" name="recintoId" value={formData.recintoId} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              {recintos.map((recinto) => (
                <option key={recinto._id} value={recinto._id}>
                  {recinto.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="condicionRecinto" className="mt-3">
            <Form.Label>Condición del Recinto</Form.Label>
            <Form.Control as="select" name="condicionRecinto" value={formData.condicionRecinto} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Cuarentena">Cuarentena</option>
              <option value="Rehabilitación">Rehabilitación</option>
              <option value="Plantel Permanente">Plantel Permanente</option>
              <option value="Internación Veterinaria">Internación Veterinaria</option>
              <option value="Presuelta">Presuelta</option>
              <option value="Tenencia Responsable">Tenencia Responsable</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );

  const renderPage3 = () => (
    <Form>
      <h5>Datos del Rescate y Lugar de Obtención</h5>
      <Row>
        <Col md={6}>
          <Form.Group controlId="origen">
            <Form.Label>Origen</Form.Label>
            <Form.Control as="select" name="origen" value={formData.origen} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Rescate">Rescate</option>
              <option value="Compra">Compra</option>
              <option value="Donación">Donación</option>
              <option value="Derivación">Derivación</option>
              <option value="Decomiso">Decomiso</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="motivoRescate" className="mt-3">
            <Form.Label>Motivo del Rescate</Form.Label>
            <Form.Control as="select" name="motivoRescate" value={formData.motivoRescate} onChange={handleChange} required>
              <option value="">Seleccionar</option>
              <option value="Ataque Animal">Ataque Animal</option>
              <option value="Ataque Humano">Ataque Humano</option>
              <option value="Acc. Auto">Acc. Auto</option>
              <option value="Acc. Doméstico">Acc. Doméstico</option>
              <option value="Fuera de hábitat">Fuera de hábitat</option>
              <option value="Decaído">Decaído</option>
              <option value="Otro">Otro</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="historiaVida" className="mt-3">
            <Form.Label>Historia de Vida</Form.Label>
            <Form.Control as="textarea" name="historiaVida" value={formData.historiaVida} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="infraccionNumero">
            <Form.Label>Número de Infracción</Form.Label>
            <Form.Control type="text" name="infraccionNumero" value={formData.infraccionNumero} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="autorizacionIntervencion" className="mt-3">
            <Form.Label>Autorización de Intervención</Form.Label>
            <Form.Control type="text" name="autorizacionIntervencion" value={formData.autorizacionIntervencion} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="lugarObtencionLugar" className="mt-3">
            <Form.Label>Lugar de Obtención</Form.Label>
            <Form.Control as="select" name="lugar" value={formData.lugarObtencion.lugar} onChange={(e) => handleNestedChange('lugarObtencion', e)} required>
              <option value="">Seleccionar</option>
              <option value="Hogar">Hogar</option>
              <option value="Vía Pública">Vía Pública</option>
              <option value="Establecimiento">Establecimiento</option>
              <option value="Otro">Otro</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="lugarObtencionDireccion" className="mt-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control type="text" name="direccion" value={formData.lugarObtencion.direccion} onChange={(e) => handleNestedChange('lugarObtencion', e)} />
          </Form.Group>
          <Form.Group controlId="lugarObtencionLocalidad" className="mt-3">
            <Form.Label>Localidad</Form.Label>
            <Form.Control type="text" name="localidad" value={formData.lugarObtencion.localidad} onChange={(e) => handleNestedChange('lugarObtencion', e)} />
          </Form.Group>
          <Form.Group controlId="lugarObtencionProvincia" className="mt-3">
            <Form.Label>Provincia</Form.Label>
            <Form.Control type="text" name="provincia" value={formData.lugarObtencion.provincia} onChange={(e) => handleNestedChange('lugarObtencion', e)} />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );

  const renderPage4 = () => (
    <Form>
      <h5>Información Veterinaria</h5>
      <Row>
        <Col md={6}>
          <Form.Group controlId="veterinario">
            <Form.Label>Veterinario</Form.Label>
            <Form.Control type="text" name="veterinario" value={formData.veterinario} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="motivoAtencionVeterinaria" className="mt-3">
            <Form.Label>Motivo de Atención Veterinaria</Form.Label>
            <Form.Control as="textarea" name="motivoAtencionVeterinaria" value={formData.motivoAtencionVeterinaria} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="condicionCautiverio" className="mt-3">
            <Form.Label>Condición de Cautiverio</Form.Label>
            <Form.Control type="text" name="condicionCautiverio" value={formData.condicionCautiverio} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="contactoVeterinario">
            <Form.Label>Contacto del Veterinario</Form.Label>
            <Form.Control type="text" name="contactoVeterinario" value={formData.contactoVeterinario} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="alimentacionRecibida" className="mt-3">
            <Form.Label>Alimentación Recibida</Form.Label>
            <Form.Control as="textarea" name="alimentacionRecibida" value={formData.alimentacionRecibida} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="fechaInicioCautiverio" className="mt-3">
            <Form.Label>Fecha de Inicio de Cautiverio</Form.Label>
            <Form.Control type="date" name="fechaInicioCautiverio" value={formData.fechaInicioCautiverio} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );

  const renderPage5 = () => (
    <Form>
      <h5>Información del Donante</h5>
      <Row>
        <Col md={6}>
          <Form.Group controlId="donanteApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control type="text" name="apellido" value={formData.donante.apellido} onChange={(e) => handleNestedChange('donante', e)} />
          </Form.Group>
          <Form.Group controlId="donanteNombre" className="mt-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="nombre" value={formData.donante.nombre} onChange={(e) => handleNestedChange('donante', e)} />
          </Form.Group>
          <Form.Group controlId="donanteDni" className="mt-3">
            <Form.Label>DNI</Form.Label>
            <Form.Control type="text" name="dni" value={formData.donante.dni} onChange={(e) => handleNestedChange('donante', e)} />
          </Form.Group>
          <Form.Group controlId="donanteDomicilio" className="mt-3">
            <Form.Label>Domicilio</Form.Label>
            <Form.Control type="text" name="domicilio" value={formData.donante.domicilio} onChange={(e) => handleNestedChange('donante', e)} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="donanteLocalidad">
            <Form.Label>Localidad</Form.Label>
            <Form.Control type="text" name="localidad" value={formData.donante.localidad} onChange={(e) => handleNestedChange('donante', e)} />
          </Form.Group>
          <Form.Group controlId="donanteProvincia" className="mt-3">
            <Form.Label>Provincia</Form.Label>
            <Form.Control type="text" name="provincia" value={formData.donante.provincia} onChange={(e) => handleNestedChange('donante', e)} />
          </Form.Group>
          <Form.Group controlId="donanteTelefono" className="mt-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control type="text" name="telefono" value={formData.donante.telefono} onChange={(e) => handleNestedChange('donante', e)} />
          </Form.Group>
          <Form.Group controlId="donanteEmail" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.donante.email} onChange={(e) => handleNestedChange('donante', e)} />
          </Form.Group>
          <Form.Group controlId="donanteContactoFauna" className="mt-3">
            <Form.Check 
              type="checkbox" 
              label="Contacto con Fauna" 
              name="contactoFauna" 
              checked={formData.donante.contactoFauna} 
              onChange={(e) => handleNestedChange('donante', e)} 
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );

  const renderPage6 = () => (
    <Form>
      <h5>Información Adicional</h5>
      <Row>
        <Col md={12}>
          <Form.Group controlId="docenteAutorizaIngreso">
            <Form.Label>Docente que Autoriza el Ingreso</Form.Label>
            <Form.Control as="select" name="docenteAutorizaIngreso" value={formData.docenteAutorizaIngreso} onChange={handleChange}>
              <option value="">Seleccionar</option>
              {docentes.map((docente) => (
                <option key={docente._id} value={docente._id}>
                  {docente.nombre} {docente.apellido}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="notasAdicionales" className="mt-3">
            <Form.Label>Notas Adicionales</Form.Label>
            <Form.Control as="textarea" name="notasAdicionales" value={formData.notasAdicionales} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Animal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {page === 1 && renderPage1()}
        {page === 2 && renderPage2()}
        {page === 3 && renderPage3()}
        {page === 4 && renderPage4()}
        {page === 5 && renderPage5()}
        {page === 6 && renderPage6()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        {page > 1 && (
          <Button variant="primary" onClick={() => setPage(page - 1)}>
            Anterior
          </Button>
        )}
        {page < 6 ? (
          <Button variant="primary" onClick={() => setPage(page + 1)}>
            Siguiente
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} disabled={uploading}>
            {uploading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;