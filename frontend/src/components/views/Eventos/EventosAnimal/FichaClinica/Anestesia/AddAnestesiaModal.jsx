import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const initialState = {
  fecha: '',
  lugarAnestesia: '',
  temperaturaAmbiente: '',
  protocoloAnestesico: {
    motivoAnestesia: '',
    tiempoAyuno: {
      comida: '',
      agua: ''
    },
    metodoContencion: '',
    inicioAnestesia: '',
    inicioIntervencion: '',
    decubito: '',
    diametroTuboEndotraqueal: '',
    finIntervencion: '',
    finAnestesia: '',
    duracionAnestesia: '',
    drogas: []
  },
  recuperacionAnestesia: {
    tiempoRecuperacion: '',
    estado: '',
    controlCabeza: '',
    estacion: '',
    recuperacionCompleta: ''
  },
  retorno: {
    tipo: '',
    complicaciones: []
  },
  evaluacionAnestesia: '',
  monitoreo: [],
  tratamientoFluidoterapia: [],
  responsable: '',
  adjuntos: []
};

const AddAnestesiaModal = ({ show, handleClose, animalId, fichaClinicaId, user, onEventoCreado }) => {
  const fileInputRef = useRef(null);
  const [anestesia, setAnestesia] = useState(initialState);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Manejadores para campos principales
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        setAnestesia(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }));
      } else {
        setAnestesia(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setAnestesia(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manejadores para drogas
  const handleAddDroga = () => {
    setAnestesia(prev => ({
      ...prev,
      protocoloAnestesico: {
        ...prev.protocoloAnestesico,
        drogas: [
          ...prev.protocoloAnestesico.drogas,
          {
            hora: '',
            farmaco: '',
            concentracion: '',
            dosis: '',
            volumen: '',
            tipo: '',
            medioVia: '',
            exitoAplicacion: '',
            efecto: ''
          }
        ]
      }
    }));
  };

  const handleRemoveDroga = (index) => {
    setAnestesia(prev => ({
      ...prev,
      protocoloAnestesico: {
        ...prev.protocoloAnestesico,
        drogas: prev.protocoloAnestesico.drogas.filter((_, i) => i !== index)
      }
    }));
  };

  const handleDrogaChange = (index, field, value) => {
    setAnestesia(prev => ({
      ...prev,
      protocoloAnestesico: {
        ...prev.protocoloAnestesico,
        drogas: prev.protocoloAnestesico.drogas.map((droga, i) => 
          i === index ? { ...droga, [field]: value } : droga
        )
      }
    }));
  };

  // Manejadores para monitoreo
  const handleAddMonitoreo = () => {
    setAnestesia(prev => ({
      ...prev,
      monitoreo: [
        ...prev.monitoreo,
        {
          hora: '',
          frecuenciaRespiratoria: '',
          frecuenciaCardiaca: '',
          pulso: '',
          temperatura: '',
          presionArterial: {
            PAS: '',
            PAD: '',
            PAM: ''
          },
          saturacionOxigeno: '',
          tiempoLlenadoCapilar: '',
          estadoHidratacion: '',
          reflejos: '',
          comentarios: ''
        }
      ]
    }));
  };

  const handleRemoveMonitoreo = (index) => {
    setAnestesia(prev => ({
      ...prev,
      monitoreo: prev.monitoreo.filter((_, i) => i !== index)
    }));
  };

  const handleMonitoreoChange = (index, field, value) => {
    setAnestesia(prev => ({
      ...prev,
      monitoreo: prev.monitoreo.map((item, i) => {
        if (i === index) {
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            return {
              ...item,
              [parent]: {
                ...item[parent],
                [child]: value
              }
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    }));
  };

  // Manejadores para fluidoterapia
  const handleAddFluidoterapia = () => {
    setAnestesia(prev => ({
      ...prev,
      tratamientoFluidoterapia: [
        ...prev.tratamientoFluidoterapia,
        {
          hora: '',
          farmaco: '',
          dosis: '',
          via: '',
          comentarios: ''
        }
      ]
    }));
  };

  const handleRemoveFluidoterapia = (index) => {
    setAnestesia(prev => ({
      ...prev,
      tratamientoFluidoterapia: prev.tratamientoFluidoterapia.filter((_, i) => i !== index)
    }));
  };

  const handleFluidoterapiaChange = (index, field, value) => {
    setAnestesia(prev => ({
      ...prev,
      tratamientoFluidoterapia: prev.tratamientoFluidoterapia.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Manejo de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/')
    );

    if (validFiles.length !== files.length) {
      Swal.fire('Error', 'Solo se permiten archivos PDF e imágenes', 'error');
      e.target.value = null;
      return;
    }

    setSelectedFiles(validFiles);
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

  // Manejo del submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const fichaClinicaId = localStorage.getItem('fichaClinicaId');
      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró una ficha clínica activa', 'error');
        return;
      }

      // Subir archivos si existen
      let adjuntosUrls = [];
      if (selectedFiles.length > 0) {
        try {
          const uploadPromises = selectedFiles.map(file => uploadFiles(file));
          adjuntosUrls = await Promise.all(uploadPromises);
          console.log('URLs de archivos subidos:', adjuntosUrls);
        } catch (error) {
          console.error('Error al subir archivos:', error);
          Swal.fire('Error', 'No se pudieron subir algunos archivos', 'error');
          return;
        }
      }

      // Crear objeto de anestesia con las URLs de los archivos
      const anestesiaData = {
        ...anestesia,
        adjuntos: adjuntosUrls,
        animalId: animalId,
        fichaClinicaId: fichaClinicaId,
        creadoPor: user._id
      };

      console.log('Datos de anestesia a enviar:', anestesiaData);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const anestesiaResponse = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}anestesia`,
        anestesiaData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Respuesta del servidor:', anestesiaResponse.data);

      if (anestesiaResponse.status === 201) {
        // Actualizar eventos en localStorage
        const eventosActuales = JSON.parse(localStorage.getItem('eventosCreados') || '[]');
        const nuevosEventos = [...eventosActuales, {
          tipo: 'Anestesia',
          id: anestesiaResponse.data._id,
          fecha: anestesiaResponse.data.fecha,
          datos: anestesiaResponse.data
        }];
        localStorage.setItem('eventosCreados', JSON.stringify(nuevosEventos));

        // Llamar al callback onEventoCreado si existe
        if (typeof onEventoCreado === 'function') {
          onEventoCreado({
            tipo: 'Anestesia',
            id: anestesiaResponse.data._id,
            fecha: anestesiaResponse.data.fecha,
            datos: anestesiaResponse.data
          });
        }

        // Limpiar el formulario y cerrar
        setAnestesia(initialState);
        setSelectedFiles([]);
        Swal.fire('Éxito', 'Anestesia guardada correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error al crear anestesia:', error);
      Swal.fire('Error', 'No se pudo crear la anestesia', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Agregar estilos comunes
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

  const buttonStyle = {
    backgroundColor: 'white',
    borderColor: '#70AA68',
    color: '#70AA68',
    borderRadius: '8px',
    padding: '8px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  };

  // Actualizar el estilo de los títulos de sección
  const sectionTitleStyle = {
    ...labelStyle,
    fontSize: '1.5rem',
    marginTop: '2.5rem',  // Aumentar el espacio superior
    marginBottom: '1.5rem' // Aumentar el espacio inferior
  };

  // Actualizar el estilo del botón
  const deleteButtonStyle = {
    backgroundColor: 'white',
    borderColor: '#dc3545',
    color: '#dc3545',
    borderRadius: '8px',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    fontSize: '0.85rem',
    marginLeft: 'auto', // Mover a la derecha
    marginTop: '1rem',  // Espacio superior para separarlo del contenido
    width: 'fit-content'
  };

  // Agregar esta función para calcular la duración
  const calcularDuracionAnestesia = (inicio, fin) => {
    if (!inicio || !fin) return '';
    
    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFin, minFin] = fin.split(':').map(Number);
    
    let diferenciaMinutos = (horaFin * 60 + minFin) - (horaInicio * 60 + minInicio);
    
    // Si la diferencia es negativa, asumimos que cruza la medianoche
    if (diferenciaMinutos < 0) {
      diferenciaMinutos += 24 * 60;
    }
    
    const horas = Math.floor(diferenciaMinutos / 60);
    const minutos = diferenciaMinutos % 60;
    
    return `${horas}h ${minutos}min`;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Anestesia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Información General */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={anestesia.fecha}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Lugar de Anestesia</Form.Label>
                <Form.Control
                  type="text"
                  name="lugarAnestesia"
                  value={anestesia.lugarAnestesia}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Temperatura Ambiente (°C)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              name="temperaturaAmbiente"
              value={anestesia.temperaturaAmbiente}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
          </Form.Group>

          {/* Protocolo Anestésico */}
          <h4 style={labelStyle}>Protocolo Anestésico</h4>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Motivo de Anestesia</Form.Label>
                <Form.Control
                  type="text"
                  name="protocoloAnestesico.motivoAnestesia"
                  value={anestesia.protocoloAnestesico.motivoAnestesia}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Tiempo de Ayuno - Comida (horas)</Form.Label>
                <Form.Control
                  type="number"
                  name="protocoloAnestesico.tiempoAyuno.comida"
                  value={anestesia.protocoloAnestesico.tiempoAyuno.comida}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Tiempo de Ayuno - Agua (horas)</Form.Label>
                <Form.Control
                  type="number"
                  name="protocoloAnestesico.tiempoAyuno.agua"
                  value={anestesia.protocoloAnestesico.tiempoAyuno.agua}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Continuación del Protocolo Anestésico */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Método de Contención</Form.Label>
                <Form.Control
                  type="text"
                  name="protocoloAnestesico.metodoContencion"
                  value={anestesia.protocoloAnestesico.metodoContencion}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Decúbito</Form.Label>
                <Form.Control
                  type="text"
                  name="protocoloAnestesico.decubito"
                  value={anestesia.protocoloAnestesico.decubito}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Diámetro Tubo Endotraqueal */}
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Diámetro Tubo Endotraqueal</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="protocoloAnestesico.diametroTuboEndotraqueal"
                  value={anestesia.protocoloAnestesico.diametroTuboEndotraqueal}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Tiempos de anestesia */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Inicio Anestesia</Form.Label>
                <Form.Control
                  type="time"
                  name="protocoloAnestesico.inicioAnestesia"
                  value={anestesia.protocoloAnestesico.inicioAnestesia}
                  onChange={(e) => {
                    handleInputChange(e);
                    const duracion = calcularDuracionAnestesia(
                      e.target.value,
                      anestesia.protocoloAnestesico.finAnestesia
                    );
                    setAnestesia(prev => ({
                      ...prev,
                      protocoloAnestesico: {
                        ...prev.protocoloAnestesico,
                        duracionAnestesia: duracion
                      }
                    }));
                  }}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Fin Anestesia</Form.Label>
                <Form.Control
                  type="time"
                  name="protocoloAnestesico.finAnestesia"
                  value={anestesia.protocoloAnestesico.finAnestesia}
                  onChange={(e) => {
                    handleInputChange(e);
                    const duracion = calcularDuracionAnestesia(
                      anestesia.protocoloAnestesico.inicioAnestesia,
                      e.target.value
                    );
                    setAnestesia(prev => ({
                      ...prev,
                      protocoloAnestesico: {
                        ...prev.protocoloAnestesico,
                        duracionAnestesia: duracion
                      }
                    }));
                  }}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Inicio Intervención</Form.Label>
                <Form.Control
                  type="time"
                  name="protocoloAnestesico.inicioIntervencion"
                  value={anestesia.protocoloAnestesico.inicioIntervencion}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Fin Intervención</Form.Label>
                <Form.Control
                  type="time"
                  name="protocoloAnestesico.finIntervencion"
                  value={anestesia.protocoloAnestesico.finIntervencion}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Duración Anestesia (calculada automáticamente) */}
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Duración Anestesia</Form.Label>
                <Form.Control
                  type="text"
                  value={anestesia.protocoloAnestesico.duracionAnestesia}
                  disabled
                  style={{ ...inputStyle, backgroundColor: '#e9ecef' }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Sección de Drogas */}
          <h4 style={sectionTitleStyle}>Drogas</h4>
          {anestesia.protocoloAnestesico.drogas.map((droga, index) => (
            <div key={index} className="border p-3 mb-3">
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Hora</Form.Label>
                    <Form.Control
                      type="time"
                      value={droga.hora}
                      onChange={(e) => handleDrogaChange(index, 'hora', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={9}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Fármaco</Form.Label>
                    <Form.Control
                      type="text"
                      value={droga.farmaco}
                      onChange={(e) => handleDrogaChange(index, 'farmaco', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Tipo</Form.Label>
                    <Form.Select
                      value={droga.tipo}
                      onChange={(e) => handleDrogaChange(index, 'tipo', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Seleccione...</option>
                      <option value="T">Tranquilizante</option>
                      <option value="I">Inmovilizante</option>
                      <option value="S">Suplemento</option>
                      <option value="M">Mantenimiento</option>
                      <option value="A">Antagonista</option>
                      <option value="O">Otros</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Medio/Vía</Form.Label>
                    <Form.Select
                      value={droga.medioVia}
                      onChange={(e) => handleDrogaChange(index, 'medioVia', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Seleccione...</option>
                      <option value="J">Jeringa</option>
                      <option value="C">Cerbatana</option>
                      <option value="D">Dardo</option>
                      <option value="B">Bater</option>
                      <option value="R">Rifle</option>
                      <option value="IM">IM</option>
                      <option value="SC">SC</option>
                      <option value="EV">EV</option>
                      <option value="IN">IN</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Éxito de Aplicación</Form.Label>
                    <Form.Select
                      value={droga.exitoAplicacion}
                      onChange={(e) => handleDrogaChange(index, 'exitoAplicacion', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Seleccione...</option>
                      <option value="T">Total</option>
                      <option value="P">Parcial</option>
                      <option value="N">Ninguna</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Concentración</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={droga.concentracion}
                      onChange={(e) => handleDrogaChange(index, 'concentracion', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Dosis</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={droga.dosis}
                      onChange={(e) => handleDrogaChange(index, 'dosis', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Volumen</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={droga.volumen}
                      onChange={(e) => handleDrogaChange(index, 'volumen', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Efecto</Form.Label>
                    <Form.Select
                      value={droga.efecto}
                      onChange={(e) => handleDrogaChange(index, 'efecto', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Seleccione...</option>
                      <option value="0">Ninguno</option>
                      <option value="1">Ligero</option>
                      <option value="2">Moderado</option>
                      <option value="3">Profundo</option>
                      <option value="4">Excesivo/Profundo</option>
                      <option value="5">Deceso</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => handleRemoveDroga(index)}
                  style={deleteButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff1f2';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} /> Eliminar Registro
                </Button>
              </div>
            </div>
          ))}

          <Button 
            variant="outline-success" 
            onClick={handleAddDroga}
            style={{
              ...buttonStyle,
              marginTop: '1rem',    // Agregar espacio superior
              marginBottom: '2rem'  // Agregar espacio inferior
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
            <FontAwesomeIcon icon={faPlus} /> Agregar Droga
          </Button>

          {/* Sección de Monitoreo */}
          <h4 style={sectionTitleStyle}>Monitoreo</h4>
          {anestesia.monitoreo.map((item, index) => (
            <div key={index} className="border p-3 mb-3">
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Hora</Form.Label>
                    <Form.Control
                      type="time"
                      value={item.hora}
                      onChange={(e) => handleMonitoreoChange(index, 'hora', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Frecuencia Resp.</Form.Label>
                    <Form.Control
                      type="number"
                      value={item.frecuenciaRespiratoria}
                      onChange={(e) => handleMonitoreoChange(index, 'frecuenciaRespiratoria', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Frecuencia Cardíaca</Form.Label>
                    <Form.Control
                      type="number"
                      value={item.frecuenciaCardiaca}
                      onChange={(e) => handleMonitoreoChange(index, 'frecuenciaCardiaca', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Pulso</Form.Label>
                    <Form.Control
                      type="text"
                      value={item.pulso}
                      onChange={(e) => handleMonitoreoChange(index, 'pulso', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Temperatura (°C)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      value={item.temperatura}
                      onChange={(e) => handleMonitoreoChange(index, 'temperatura', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>PAS</Form.Label>
                    <Form.Control
                      type="number"
                      value={item.presionArterial.PAS}
                      onChange={(e) => handleMonitoreoChange(index, 'presionArterial.PAS', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>PAD</Form.Label>
                    <Form.Control
                      type="number"
                      value={item.presionArterial.PAD}
                      onChange={(e) => handleMonitoreoChange(index, 'presionArterial.PAD', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>PAM</Form.Label>
                    <Form.Control
                      type="number"
                      value={item.presionArterial.PAM}
                      onChange={(e) => handleMonitoreoChange(index, 'presionArterial.PAM', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Saturación O2 (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={item.saturacionOxigeno}
                      onChange={(e) => handleMonitoreoChange(index, 'saturacionOxigeno', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Tiempo Llenado Capilar</Form.Label>
                    <Form.Control
                      type="text"
                      value={item.tiempoLlenadoCapilar}
                      onChange={(e) => handleMonitoreoChange(index, 'tiempoLlenadoCapilar', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Estado Hidratación</Form.Label>
                    <Form.Control
                      type="text"
                      value={item.estadoHidratacion}
                      onChange={(e) => handleMonitoreoChange(index, 'estadoHidratacion', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Reflejos</Form.Label>
                    <Form.Control
                      type="text"
                      value={item.reflejos}
                      onChange={(e) => handleMonitoreoChange(index, 'reflejos', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Comentarios</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={item.comentarios}
                      onChange={(e) => handleMonitoreoChange(index, 'comentarios', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => handleRemoveMonitoreo(index)}
                  style={deleteButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff1f2';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} /> Eliminar Registro
                </Button>
              </div>
            </div>
          ))}

          <Button 
            variant="outline-success" 
            onClick={handleAddMonitoreo}
            style={{
              ...buttonStyle,
              marginTop: '1rem',
              marginBottom: '2rem'
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
            <FontAwesomeIcon icon={faPlus} /> Agregar Registro de Monitoreo
          </Button>

          {/* Sección de Fluidoterapia */}
          <h4 style={sectionTitleStyle}>Tratamiento Fluidoterapia</h4>
          {anestesia.tratamientoFluidoterapia.map((item, index) => (
            <div key={index} className="border p-3 mb-3">
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Hora</Form.Label>
                    <Form.Control
                      type="time"
                      value={item.hora}
                      onChange={(e) => handleFluidoterapiaChange(index, 'hora', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Fármaco</Form.Label>
                    <Form.Control
                      type="text"
                      value={item.farmaco}
                      onChange={(e) => handleFluidoterapiaChange(index, 'farmaco', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Dosis</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={item.dosis}
                      onChange={(e) => handleFluidoterapiaChange(index, 'dosis', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Vía</Form.Label>
                    <Form.Control
                      type="text"
                      value={item.via}
                      onChange={(e) => handleFluidoterapiaChange(index, 'via', e.target.value)}
                      style={inputStyle}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Comentarios</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={item.comentarios}
                  onChange={(e) => handleFluidoterapiaChange(index, 'comentarios', e.target.value)}
                  style={inputStyle}
                />
              </Form.Group>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => handleRemoveFluidoterapia(index)}
                  style={deleteButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff1f2';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} /> Eliminar Registro
                </Button>
              </div>
            </div>
          ))}

          <Button 
            variant="outline-success" 
            onClick={handleAddFluidoterapia}
            style={{
              ...buttonStyle,
              marginTop: '1rem',
              marginBottom: '2rem'
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
            <FontAwesomeIcon icon={faPlus} /> Agregar Registro de Fluidoterapia
          </Button>

          {/* Recuperación Anestésica */}
          <h4 style={sectionTitleStyle}>Recuperación Anestésica</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Tiempo de Recuperación (minutos)</Form.Label>
                <Form.Control
                  type="number"
                  name="recuperacionAnestesia.tiempoRecuperacion"
                  value={anestesia.recuperacionAnestesia.tiempoRecuperacion}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Estado</Form.Label>
                <Form.Select
                  name="recuperacionAnestesia.estado"
                  value={anestesia.recuperacionAnestesia.estado}
                  onChange={handleInputChange}
                  style={inputStyle}
                >
                  <option value="">Seleccione...</option>
                  <option value="tranquila">Tranquila</option>
                  <option value="agitada">Agitada</option>
                  <option value="re-sedación">Re-sedación</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Control de Cabeza</Form.Label>
                <Form.Control
                  type="text"
                  name="recuperacionAnestesia.controlCabeza"
                  value={anestesia.recuperacionAnestesia.controlCabeza}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Estación</Form.Label>
                <Form.Control
                  type="text"
                  name="recuperacionAnestesia.estacion"
                  value={anestesia.recuperacionAnestesia.estacion}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Recuperación Completa</Form.Label>
                <Form.Control
                  type="text"
                  name="recuperacionAnestesia.recuperacionCompleta"
                  value={anestesia.recuperacionAnestesia.recuperacionCompleta}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Retorno */}
          <h4 style={labelStyle}>Retorno</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Tipo</Form.Label>
                <Form.Select
                  name="retorno.tipo"
                  value={anestesia.retorno.tipo}
                  onChange={handleInputChange}
                  style={inputStyle}
                >
                  <option value="">Seleccione...</option>
                  <option value="Normal">Normal</option>
                  <option value="Prolongado">Prolongado</option>
                  <option value="Deceso">Deceso</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={labelStyle}>Complicaciones</Form.Label>
                <Form.Select
                  multiple
                  name="retorno.complicaciones"
                  value={anestesia.retorno.complicaciones}
                  onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions, option => option.value);
                    setAnestesia(prev => ({
                      ...prev,
                      retorno: {
                        ...prev.retorno,
                        complicaciones: options
                      }
                    }));
                  }}
                  style={{ height: '120px' }}
                >
                  <option value="Ninguna">Ninguna</option>
                  <option value="Apnea">Apnea</option>
                  <option value="Regurgitación/Vómito">Regurgitación/Vómito</option>
                  <option value="Secreciones">Secreciones</option>
                  <option value="Otras">Otras</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Mantenga presionado Ctrl (Windows) o Cmd (Mac) para seleccionar múltiples opciones
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* Evaluación y Responsable */}
          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Evaluación Anestesia</Form.Label>
            <Form.Select
              name="evaluacionAnestesia"
              value={anestesia.evaluacionAnestesia}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="">Seleccione...</option>
              <option value="Excelente">Excelente</option>
              <option value="Buena">Buena</option>
              <option value="Regular">Regular</option>
              <option value="Mala">Mala</option>
              <option value="Pésima">Pésima</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={labelStyle}>Responsable</Form.Label>
            <Form.Control
              type="text"
              name="responsable"
              value={anestesia.responsable}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
          </Form.Group>

          {/* Archivos Adjuntos */}
          <h4 style={sectionTitleStyle}>Archivos Adjuntos</h4>
          <Form.Group className="mt-2" style={{ marginTop: '-1.5rem' }}>
            <div 
              style={{
                border: '2px dashed #70AA68',
                borderRadius: '8px',
                padding: '30px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: '#f8f9fa',
                marginTop: '0.2rem'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ marginBottom: '10px' }}>
                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '48px', color: '#70AA68' }}></i>
              </div>

              <div style={{ color: '#70AA68', fontSize: '16px', marginBottom: '8px' }}>
                Haga clic o arrastre los archivos aquí
              </div>

              <div style={{ color: '#666', fontSize: '14px' }}>
                Formatos permitidos: PDF, JPG, PNG
              </div>

              <Form.Control
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Vista previa de archivos */}
            {selectedFiles.length > 0 && (
              <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                <h6 style={{ ...labelStyle, marginBottom: '1rem' }}>Archivos seleccionados:</h6>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        maxWidth: '250px'
                      }}
                    >
                      <div style={{ marginRight: '1rem' }}>
                        {file.type.includes('image') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <i className="fas fa-file-pdf" style={{ fontSize: '2rem', color: '#dc3545' }}></i>
                        )}
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {file.name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <Button
                        variant="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newFiles = [...selectedFiles];
                          newFiles.splice(index, 1);
                          setSelectedFiles(newFiles);
                        }}
                        style={{ color: '#dc3545', padding: '0.25rem' }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form.Group>

          <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            
            <Button 
              variant="success" 
              type="submit" 
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
              {uploading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAnestesiaModal;