import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddNecropsiaModal = ({ show, handleClose, animalId, fichaClinicaId, user, onEventoCreado }) => {
  const [necropsia, setNecropsia] = useState({
    fechaMuerte: '',
    fechaNecropsia: new Date().toISOString().split('T')[0],
    conservacionCarcasa: '',
    condicionMuerte: '',
    localNecropsia: '',
    personaRealiza: '',
    historiaClinica: '',
    sospechaClinica: '',
    descripcionNecroscopica: {
      examenGeneral: '',
      cavidadesCorporeas: '',
      sistemaMusculoEsqueletico: '',
      sistemaRespiratorio: '',
      sistemaCardiovascular: '',
      sistemaDigestivo: '',
      sistemaLinfoHematopoyetico: '',
      sistemaUrinario: '',
      sistemaReproductor: '',
      sistemaEndocrino: '',
      sistemaNerviosoCentral: ''
    },
    otrasObservaciones: {
      evidenciaAlimentoEstomago: false,
      diagnosticosPreliminares: '',
      causaMuertePreliminar: '',
      comentariosAdicionales: '',
      estudiosLaboratorio: '',
      estadoMaterial: ''
    },
    observacionesGenerales: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
    const uploadPreset = 'unsigned_preset';
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNecropsia(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setNecropsia(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleNavigation = (e, direction) => {
    e.preventDefault();
    if (direction === 'next') {
      setCurrentPage(prev => prev + 1);
    } else {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPage !== 4) return;
    
    setUploading(true);
    try {
      // Subir archivos
      let archivosUrls = [];
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => uploadFiles(file));
        archivosUrls = await Promise.all(uploadPromises);
      }

      const necropsiaData = {
        ...necropsia,
        archivosAdjuntos: archivosUrls,
        animalId,
        fichaClinicaId,
        creadoPor: user._id
      };

      const token = localStorage.getItem('token');
      const necropsiaResponse = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}necropsia`,
        necropsiaData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (necropsiaResponse.status === 201) {
        // Actualizar la ficha clínica
        await axios.put(
          `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`,
          { necropsiaId: necropsiaResponse.data.necropsiaId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Actualizar eventos en localStorage
        const eventosActuales = JSON.parse(localStorage.getItem('eventosCreados') || '[]');
        const nuevosEventos = [...eventosActuales, {
          tipo: 'Necropsia',
          id: necropsiaResponse.data._id,
          fecha: necropsiaResponse.data.fechaNecropsia,
          datos: {
            ...necropsiaResponse.data,
            archivosUrls: archivosUrls
          }
        }];
        localStorage.setItem('eventosCreados', JSON.stringify(nuevosEventos));

        if (typeof onEventoCreado === 'function') {
          onEventoCreado({
            ...necropsiaResponse.data,
            archivosUrls: archivosUrls
          });
        }

        Swal.fire('Éxito', 'Necropsia guardada correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Error al guardar la necropsia', 'error');
    } finally {
      setUploading(false);
    }
  };

  const renderPageContent = () => {
    switch(currentPage) {
      case 1:
        return (
          <>
            <h4>Información General</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Muerte</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaMuerte"
                    value={necropsia.fechaMuerte}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Necropsia</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaNecropsia"
                    value={necropsia.fechaNecropsia}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Conservación de la Carcasa</Form.Label>
                  <Form.Select
                    name="conservacionCarcasa"
                    value={necropsia.conservacionCarcasa}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Refrigerado">Refrigerado</option>
                    <option value="Congelado">Congelado</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Condición de Muerte</Form.Label>
                  <Form.Select
                    name="condicionMuerte"
                    value={necropsia.condicionMuerte}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Natural">Natural</option>
                    <option value="Eutanasia">Eutanasia</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Local de Necropsia</Form.Label>
              <Form.Control
                type="text"
                name="localNecropsia"
                value={necropsia.localNecropsia}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Persona que Realiza</Form.Label>
              <Form.Control
                type="text"
                name="personaRealiza"
                value={necropsia.personaRealiza}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Historia Clínica</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="historiaClinica"
                value={necropsia.historiaClinica}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sospecha Clínica</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="sospechaClinica"
                value={necropsia.sospechaClinica}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        );

      case 2:
        return (
          <>
            <h4>Descripción Necroscópica</h4>
            
            <Form.Group className="mb-3">
              <Form.Label>Examen General</Form.Label>
              <Form.Text className="text-muted d-block">
                Condición física y nutricional; pelaje; plumaje; escamas; orificios naturales
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.examenGeneral"
                value={necropsia.descripcionNecroscopica.examenGeneral}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cavidades Corpóreas</Form.Label>
              <Form.Text className="text-muted d-block">
                Depósitos de grasa; celoma; peritoneo; pleura; sacos aéreos
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.cavidadesCorporeas"
                value={necropsia.descripcionNecroscopica.cavidadesCorporeas}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sistema Músculo Esquelético</Form.Label>
              <Form.Text className="text-muted d-block">
                Huesos, musculatura, articulaciones, tendones, caparazón
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.sistemaMusculoEsqueletico"
                value={necropsia.descripcionNecroscopica.sistemaMusculoEsqueletico}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sistema Respiratorio</Form.Label>
              <Form.Text className="text-muted d-block">
                Narinas, senos paranasales, laringe, tráquea, bronquios, pulmones, sacos aéreos, siringe
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.sistemaRespiratorio"
                value={necropsia.descripcionNecroscopica.sistemaRespiratorio}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sistema Cardiovascular</Form.Label>
              <Form.Text className="text-muted d-block">
                Corazón, válvulas, pericardio, grandes vasos
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.sistemaCardiovascular"
                value={necropsia.descripcionNecroscopica.sistemaCardiovascular}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        );

      case 3:
        return (
          <>
            <h4>Descripción Necroscópica (continuación)</h4>

            <Form.Group className="mb-3">
              <Form.Label>Sistema Digestivo</Form.Label>
              <Form.Text className="text-muted d-block">
                Boca, dientes, glándula salival, lengua, esófago, estómago, intestino delgado y grueso, ciego, hígado, vesícula biliar, páncreas, buche, molleja, proventrículo, cloaca
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.sistemaDigestivo"
                value={necropsia.descripcionNecroscopica.sistemaDigestivo}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sistema Linfo-hematopoyético</Form.Label>
              <Form.Text className="text-muted d-block">
                Amígdalas, timo, bazo, linfonódulos, médula ósea, bursa
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.sistemaLinfoHematopoyetico"
                value={necropsia.descripcionNecroscopica.sistemaLinfoHematopoyetico}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sistema Urinario</Form.Label>
              <Form.Text className="text-muted d-block">
                Riñón, uréteres, vejiga, uretra, cloaca
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.sistemaUrinario"
                value={necropsia.descripcionNecroscopica.sistemaUrinario}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sistema Reproductor</Form.Label>
              <Form.Text className="text-muted d-block">
                Gónadas, oviducto, órganos sexuales accesorios, glándula de veneno
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.sistemaReproductor"
                value={necropsia.descripcionNecroscopica.sistemaReproductor}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sistema Endocrino</Form.Label>
              <Form.Text className="text-muted d-block">
                Tiroides, paratiroides, adrenales, hipófisis
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.sistemaEndocrino"
                value={necropsia.descripcionNecroscopica.sistemaEndocrino}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sistema Nervioso Central</Form.Label>
              <Form.Text className="text-muted d-block">
                Ojos, oídos, encéfalo, meninges, médula espinal
              </Form.Text>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcionNecroscopica.sistemaNerviosoCentral"
                value={necropsia.descripcionNecroscopica.sistemaNerviosoCentral}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        );

      case 4:
        return (
          <>
            <h4>Otras Observaciones</h4>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Evidencia de Alimento en Estómago"
                name="otrasObservaciones.evidenciaAlimentoEstomago"
                checked={necropsia.otrasObservaciones.evidenciaAlimentoEstomago}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Diagnósticos Preliminares</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="otrasObservaciones.diagnosticosPreliminares"
                value={necropsia.otrasObservaciones.diagnosticosPreliminares}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Causa de Muerte Preliminar</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="otrasObservaciones.causaMuertePreliminar"
                value={necropsia.otrasObservaciones.causaMuertePreliminar}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Comentarios Adicionales</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="otrasObservaciones.comentariosAdicionales"
                value={necropsia.otrasObservaciones.comentariosAdicionales}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estudios de Laboratorio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="otrasObservaciones.estudiosLaboratorio"
                value={necropsia.otrasObservaciones.estudiosLaboratorio}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado del Material</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="otrasObservaciones.estadoMaterial"
                value={necropsia.otrasObservaciones.estadoMaterial}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observaciones Generales</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observacionesGenerales"
                value={necropsia.observacionesGenerales}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Archivos Adjuntos</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,image/*"
              />
              <Form.Text className="text-muted">
                Puede seleccionar múltiples archivos (PDF o imágenes)
              </Form.Text>
            </Form.Group>
          </>
        );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nueva Necropsia</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Form noValidate onSubmit={handleSubmit}>
          {renderPageContent()}
          
          <div className="d-flex justify-content-between mt-3">
            <Button 
              variant="secondary" 
              type="button"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            
            <div>
              {currentPage > 1 && (
                <Button 
                  variant="outline-primary"
                  type="button"
                  onClick={(e) => handleNavigation(e, 'prev')}
                  className="me-2"
                >
                  Anterior
                </Button>
              )}
              
              {currentPage < 4 ? (
                <Button 
                  variant="primary"
                  type="button"
                  onClick={(e) => handleNavigation(e, 'next')}
                >
                  Siguiente
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? 'Guardando...' : 'Guardar Necropsia'}
                </Button>
              )}
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNecropsiaModal;