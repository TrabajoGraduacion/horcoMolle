import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import DrogasForm from './components/DrogasForm';
import MonitoreoForm from './components/MonitoreoForm';
import FluidoterapiaForm from './components/FluidoterapiaForm';

const EditAnestesiaModal = ({ show, handleClose, eventoId, animalId, user, onEventoActualizado }) => {
  const [anestesia, setAnestesia] = useState({
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
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const obtenerAnestesia = async () => {
      try {
        if (eventoId) {
          setLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${import.meta.env.VITE_API_USUARIO}anestesia/${eventoId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          const anestesiaData = response.data;
          
          let fechaFormateada = '';
          try {
            if (anestesiaData.fecha) {
              fechaFormateada = new Date(anestesiaData.fecha).toISOString().split('T')[0];
            }
          } catch (error) {
            console.error('Error al formatear la fecha:', error);
            fechaFormateada = '';
          }

          setAnestesia({
            ...anestesiaData,
            fecha: fechaFormateada,
            adjuntos: anestesiaData.adjuntos || []
          });
        }
      } catch (error) {
        console.error('Error al obtener anestesia:', error);
        Swal.fire('Error', 'No se pudo obtener la anestesia', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (show && eventoId) {
      obtenerAnestesia();
    }
  }, [show, eventoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setAnestesia(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setAnestesia(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

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

  const uploadFileToCloudinary = async (file) => {
    const uploadPreset = 'unsigned_pdf_preset';
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error al subir archivo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const fichaClinicaId = localStorage.getItem('fichaClinicaId');
      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró la ficha clínica activa', 'error');
        return;
      }

      let nuevasUrls = [];
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => uploadFileToCloudinary(file));
        nuevasUrls = await Promise.all(uploadPromises);
      }

      const todasLasUrls = [...anestesia.adjuntos, ...nuevasUrls];

      const anestesiaData = {
        ...anestesia,
        fecha: new Date(anestesia.fecha).toISOString(),
        adjuntos: todasLasUrls,
        animalId,
        fichaClinicaId,
        actualizadoPor: user._id
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_USUARIO}anestesia/${eventoId}`,
        anestesiaData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        onEventoActualizado(response.data);
        Swal.fire('Éxito', 'Anestesia actualizada correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error al actualizar anestesia:', error);
      Swal.fire('Error', 'No se pudo actualizar la anestesia', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleViewAdjunto = (url) => {
    window.open(url, '_blank');
  };

  const handleDeleteAdjunto = async (urlToDelete) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'El archivo será eliminado permanentemente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setAnestesia(prev => ({
          ...prev,
          adjuntos: prev.adjuntos.filter(
            (url) => url !== urlToDelete
          )
        }));
      }
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      Swal.fire('Error', 'No se pudo eliminar el archivo', 'error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Anestesia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="fecha"
                    value={anestesia.fecha}
                    onChange={handleInputChange}
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lugar de Anestesia</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="lugarAnestesia"
                    value={anestesia.lugarAnestesia}
                    onChange={handleInputChange}
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Temperatura Ambiente (°C)</Form.Label>
              <Form.Control 
                type="number" 
                step="0.1"
                name="temperaturaAmbiente"
                value={anestesia.temperaturaAmbiente}
                onChange={handleInputChange}
                required 
              />
            </Form.Group>

            <h4>Protocolo Anestésico</h4>
            <Form.Group className="mb-3">
              <Form.Label>Motivo de Anestesia</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="protocoloAnestesico.motivoAnestesia"
                value={anestesia.protocoloAnestesico.motivoAnestesia}
                onChange={handleInputChange}
                required 
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiempo de Ayuno - Comida (horas)</Form.Label>
                  <Form.Control 
                    type="number"
                    name="protocoloAnestesico.tiempoAyuno.comida"
                    value={anestesia.protocoloAnestesico.tiempoAyuno.comida}
                    onChange={handleInputChange}
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiempo de Ayuno - Agua (horas)</Form.Label>
                  <Form.Control 
                    type="number"
                    name="protocoloAnestesico.tiempoAyuno.agua"
                    value={anestesia.protocoloAnestesico.tiempoAyuno.agua}
                    onChange={handleInputChange}
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>

            <DrogasForm 
              drogas={anestesia.protocoloAnestesico.drogas}
              onChange={(drogas) => setAnestesia(prev => ({
                ...prev,
                protocoloAnestesico: {
                  ...prev.protocoloAnestesico,
                  drogas
                }
              }))}
            />

            <MonitoreoForm 
              monitoreo={anestesia.monitoreo}
              onChange={(monitoreo) => setAnestesia(prev => ({
                ...prev,
                monitoreo
              }))}
            />

            <FluidoterapiaForm 
              tratamientoFluidoterapia={anestesia.tratamientoFluidoterapia}
              onChange={(tratamientoFluidoterapia) => setAnestesia(prev => ({
                ...prev,
                tratamientoFluidoterapia
              }))}
            />

            <h4>Recuperación Anestésica</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tiempo de Recuperación (minutos)</Form.Label>
                  <Form.Control
                    type="number"
                    name="recuperacionAnestesia.tiempoRecuperacion"
                    value={anestesia.recuperacionAnestesia.tiempoRecuperacion}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="recuperacionAnestesia.estado"
                    value={anestesia.recuperacionAnestesia.estado}
                    onChange={handleInputChange}
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
                  <Form.Label>Control de Cabeza</Form.Label>
                  <Form.Control
                    type="text"
                    name="recuperacionAnestesia.controlCabeza"
                    value={anestesia.recuperacionAnestesia.controlCabeza}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estación</Form.Label>
                  <Form.Control
                    type="text"
                    name="recuperacionAnestesia.estacion"
                    value={anestesia.recuperacionAnestesia.estacion}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Recuperación Completa</Form.Label>
                  <Form.Control
                    type="text"
                    name="recuperacionAnestesia.recuperacionCompleta"
                    value={anestesia.recuperacionAnestesia.recuperacionCompleta}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4>Retorno</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    name="retorno.tipo"
                    value={anestesia.retorno.tipo}
                    onChange={handleInputChange}
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
                  <Form.Label>Complicaciones</Form.Label>
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
                  >
                    <option value="Ninguna">Ninguna</option>
                    <option value="Apnea">Apnea</option>
                    <option value="Regurgitación/Vómito">Regurgitación/Vómito</option>
                    <option value="Secreciones">Secreciones</option>
                    <option value="Otras">Otras</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Evaluación Anestesia</Form.Label>
              <Form.Select
                name="evaluacionAnestesia"
                value={anestesia.evaluacionAnestesia}
                onChange={handleInputChange}
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
              <Form.Label>Responsable</Form.Label>
              <Form.Control
                type="text"
                name="responsable"
                value={anestesia.responsable}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Adjuntos */}
            <Form.Group className="mb-3">
              <Form.Label>Adjuntos</Form.Label>
              {anestesia.adjuntos && anestesia.adjuntos.length > 0 && (
                <div className="mb-3">
                  {anestesia.adjuntos.map((url, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <span className="me-2">Archivo {index + 1}</span>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleViewAdjunto(url)}
                      >
                        <FontAwesomeIcon icon={faEye} /> Ver
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteAdjunto(url)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Form.Control 
                type="file" 
                multiple
                onChange={handleFileChange}
                accept=".pdf,image/*"
              />
              <Form.Text className="text-muted">
                Puede seleccionar múltiples archivos PDF e imágenes
              </Form.Text>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button variant="primary" type="submit" disabled={uploading}>
                {uploading ? 'Actualizando...' : 'Actualizar Anestesia'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditAnestesiaModal;
