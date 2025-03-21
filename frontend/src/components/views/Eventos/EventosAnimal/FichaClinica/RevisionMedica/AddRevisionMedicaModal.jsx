import React, { useState } from 'react';
import { Modal, Button, Form, Tabs, Tab, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddRevisionMedicaModal = ({ show, handleClose, animalId, refreshData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [revisionMedica, setRevisionMedica] = useState({
    tipoRevision: '',
    fechaRevision: new Date().toISOString().split('T')[0],
    veterinario: '',
    observacionesGenerales: '',
    archivosAdjuntos: [],
    mamiferos: {},
    aves: {},
    reptiles: {}
  });

  const [subPage, setSubPage] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tipoAnimal, setTipoAnimal] = useState(null);

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const fields = name.split('.');
      setRevisionMedica(prev => {
        let newState = { ...prev };
        let current = newState;
        
        for (let i = 0; i < fields.length - 1; i++) {
          if (!current[fields[i]]) {
            current[fields[i]] = {};
          }
          current = current[fields[i]];
        }
        
        current[fields[fields.length - 1]] = value;
        return newState;
      });
    } else {
      setRevisionMedica(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTipoAnimalChange = (selectedOption) => {
    setTipoAnimal(selectedOption);
    setRevisionMedica(prev => ({
      ...prev,
      tipoRevision: selectedOption.value,
      mamiferos: selectedOption.value === 'Mamiferos' ? {} : null,
      aves: selectedOption.value === 'Aves' ? {} : null,
      reptiles: selectedOption.value === 'Reptiles' ? {} : null
    }));
    setSubPage(1);
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

  const handleSubmit = async (e) => {
    console.log('Iniciando submit');
    e.preventDefault();
    setIsLoading(true);

    try {
      const fichaClinicaId = localStorage.getItem('fichaClinicaId');
      console.log('FichaClinicaId:', fichaClinicaId);

      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró una ficha clínica activa', 'error');
        return;
      }

      // Subir archivos si existen
      let archivosUrls = [];
      if (selectedFiles.length > 0) {
        try {
          const uploadPromises = selectedFiles.map(file => uploadFiles(file));
          archivosUrls = await Promise.all(uploadPromises);
          console.log('URLs de archivos subidos:', archivosUrls);
        } catch (error) {
          console.error('Error al subir archivos:', error);
          Swal.fire('Error', 'No se pudieron subir algunos archivos', 'error');
          return;
        }
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Preparar los datos con los archivos
      const revisionMedicaData = {
        ...revisionMedica,
        archivosAdjuntos: archivosUrls,
        animalId,
        fichaClinicaId,
        tipoAnimal: tipoAnimal?.value
      };

      console.log('Datos a enviar:', revisionMedicaData);

      // Crear la revisión médica
      const response = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}revision-medica`,
        revisionMedicaData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Respuesta:', response);

      if (response.status === 201) {
        // Actualizar eventos en localStorage
        const eventosActuales = JSON.parse(localStorage.getItem('eventosCreados') || '[]');
        const nuevosEventos = [...eventosActuales, {
          tipo: 'RevisionMedica',
          id: response.data._id,
          fecha: response.data.fechaRevision,
          datos: {
            ...response.data,
            archivosUrls
          }
        }];
        localStorage.setItem('eventosCreados', JSON.stringify(nuevosEventos));

        // Actualizar la ficha clínica
        await axios.put(
          `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`,
          { revisionMedicaId: response.data.revisionMedicaId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        Swal.fire('Éxito', 'Revisión médica guardada correctamente', 'success');
        if (typeof refreshData === 'function') {
          refreshData();
        }
        handleClose();
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', error.response?.data?.message || 'Error al guardar la revisión médica', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMamiferosContent = () => {
    const renderSubPageContent = () => {
      switch (subPage) {
        case 1:
          return (
            <>
              <h5>Examen Objetivo General</h5>
              <Form.Group className="mb-3">
                <Form.Label>Motivo de Revisión</Form.Label>
                <Form.Select
                  name="mamiferos.motivoRevision"
                  value={revisionMedica.mamiferos?.motivoRevision || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="ingreso">Ingreso</option>
                  <option value="tratamiento">Tratamiento</option>
                  <option value="revisión anual">Revisión Anual</option>
                  <option value="expresión de patología">Expresión de Patología</option>
                  <option value="otro">Otro</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado Sensorio</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.examenObjetivoGeneral.estadoSensorio"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.estadoSensorio || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fascia</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.examenObjetivoGeneral.fascia"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.fascia || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Actitudes y Posturas</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.examenObjetivoGeneral.actitudesPosturas"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.actitudesPosturas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado de Nutrición</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.examenObjetivoGeneral.estadoNutricion"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.estadoNutricion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado de Piel y Manto</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.examenObjetivoGeneral.estadoPielManto"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.estadoPielManto || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Coloración de Mucosas</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.examenObjetivoGeneral.coloracionMucosas"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.coloracionMucosas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nódulos Linfáticos</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.examenObjetivoGeneral.nodulosLinfaticos"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.nodulosLinfaticos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado de Hidratación</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.examenObjetivoGeneral.estadoHidratacion"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.estadoHidratacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Constantes Fisiológicas</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Temperatura (°C)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      name="mamiferos.examenObjetivoGeneral.constantesFisiologicas.temperatura"
                      value={revisionMedica.mamiferos?.examenObjetivoGeneral?.constantesFisiologicas?.temperatura || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia Cardíaca</Form.Label>
                    <Form.Control
                      type="number"
                      name="mamiferos.examenObjetivoGeneral.constantesFisiologicas.frecuenciaCardiaca"
                      value={revisionMedica.mamiferos?.examenObjetivoGeneral?.constantesFisiologicas?.frecuenciaCardiaca || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia Respiratoria</Form.Label>
                    <Form.Control
                      type="number"
                      name="mamiferos.examenObjetivoGeneral.constantesFisiologicas.frecuenciaRespiratoria"
                      value={revisionMedica.mamiferos?.examenObjetivoGeneral?.constantesFisiologicas?.frecuenciaRespiratoria || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tiempo Llenado Capilar</Form.Label>
                    <Form.Control
                      type="text"
                      name="mamiferos.examenObjetivoGeneral.constantesFisiologicas.tiempoLlenadoCapilar"
                      value={revisionMedica.mamiferos?.examenObjetivoGeneral?.constantesFisiologicas?.tiempoLlenadoCapilar || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h5>Examen Topográfico</h5>
              <h6>Cabeza y Cuello</h6>
              <Form.Group className="mb-3">
                <Form.Label>Pupilas</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.cabezaCuello.pupilas"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.cabezaCuello?.pupilas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cavidad Bucal</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.cabezaCuello.cavidadBucal"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.cabezaCuello?.cavidadBucal || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Piezas Dentarias</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.cabezaCuello.piezasDentarias"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.cabezaCuello?.piezasDentarias || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Oídos</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.cabezaCuello.oidos"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.cabezaCuello?.oidos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Resto del Cuerpo</h6>
              <Form.Group className="mb-3">
                <Form.Label>Tórax</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.torax"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.torax || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Abdomen</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.abdomen"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.abdomen || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Aparatos</h6>

              <Form.Group className="mb-3">
                <Form.Label>Aparato Urinario Reproductor</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.aparatoUrinarioReproductor"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.aparatoUrinarioReproductor || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Aparato Locomotor</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.aparatoLocomotor"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.aparatoLocomotor || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Aparato Estático Dinámico</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.aparatoEstaticoDinamico"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.aparatoEstaticoDinamico || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Aparato Músculo-esqueletico</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.aparatoMusculoesqueletico"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.aparatoMusculoesqueletico || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estación/Decúbito</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.topografico.estacionDecubito"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.estacionDecubito || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

                      </>
          );

        case 2:
          return (
            <>
              <h5>Examen Funcional - Sistemas</h5>
              
              <h6>Sistema Respiratorio</h6>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaRespiratorio.descripcion"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.descripcion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Frecuencia Respiratoria y Ritmo</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaRespiratorio.frecuenciaRespiratoriaRitmo"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.frecuenciaRespiratoriaRitmo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cavidad Nasal</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaRespiratorio.cavidadNasal"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.cavidadNasal || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Senos</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaRespiratorio.senos"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.senos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Laringe</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaRespiratorio.laringe"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.laringe || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tráquea</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaRespiratorio.traquea"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.traquea || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tórax y Área Pulmonar</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaRespiratorio.toraxAreaPulmonar"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.toraxAreaPulmonar || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Sistema Cardiovascular</h6>
              <Form.Group className="mb-3">
                <Form.Label>Inspección</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaCardiovascular.inspeccion"
                  value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.inspeccion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Auscultación</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaCardiovascular.auscultacion"
                  value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.auscultacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia Cardíaca</Form.Label>
                    <Form.Control
                      type="number"
                      name="mamiferos.funcional.sistemaCardiovascular.frecuenciaCardiaca"
                      value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.frecuenciaCardiaca || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ritmo</Form.Label>
                    <Form.Control
                      type="text"
                      name="mamiferos.funcional.sistemaCardiovascular.ritmo"
                      value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.ritmo || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Soplos</Form.Label>
                    <Form.Control
                      type="text"
                      name="mamiferos.funcional.sistemaCardiovascular.soplos"
                      value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.soplos || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Pulso</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaCardiovascular.pulso"
                  value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.pulso || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Presión Arterial</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>PAS</Form.Label>
                    <Form.Control
                      type="number"
                      name="mamiferos.funcional.sistemaCardiovascular.presionArterial.PAS"
                      value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.presionArterial?.PAS || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>PAD</Form.Label>
                    <Form.Control
                      type="number"
                      name="mamiferos.funcional.sistemaCardiovascular.presionArterial.PAD"
                      value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.presionArterial?.PAD || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>PAM</Form.Label>
                    <Form.Control
                      type="number"
                      name="mamiferos.funcional.sistemaCardiovascular.presionArterial.PAM"
                      value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.presionArterial?.PAM || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          );

        case 3:
          return (
            <>
              <h5>Sistema Digestivo</h5>
              <Form.Group className="mb-3">
                <Form.Label>Boca</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaDigestivo.boca"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.boca || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Esófago</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaDigestivo.esofago"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.esofago || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hígado</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaDigestivo.higado"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.higado || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estómago</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaDigestivo.estomago"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.estomago || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Intestino Delgado</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaDigestivo.intestinoDelgado"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.intestinoDelgado || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Intestino Grueso</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaDigestivo.intestinoGrueso"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.intestinoGrueso || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Recto</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaDigestivo.recto"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.recto || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ano</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaDigestivo.ano"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.ano || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Sistema Urinario</h5>
              <Form.Group className="mb-3">
                <Form.Label>Riñones</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaUrinario.rinones"
                  value={revisionMedica.mamiferos?.funcional?.sistemaUrinario?.rinones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Vejiga</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaUrinario.vejiga"
                  value={revisionMedica.mamiferos?.funcional?.sistemaUrinario?.vejiga || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Uretra</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaUrinario.uretra"
                  value={revisionMedica.mamiferos?.funcional?.sistemaUrinario?.uretra || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Sistema Reproductor</h5>
              <h6>Hembra</h6>
              <Form.Group className="mb-3">
                <Form.Label>Vulva</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.hembra.vulva"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.vulva || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Vestíbulo</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.hembra.vestibulo"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.vestibulo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Vagina</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.hembra.vagina"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.vagina || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Útero</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.hembra.utero"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.utero || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ovarios</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.hembra.ovarios"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.ovarios || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Macho</h6>
              <Form.Group className="mb-3">
                <Form.Label>Escroto</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.macho.escroto"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.macho?.escroto || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Testículos</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.macho.testiculos"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.macho?.testiculos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Epidídimo</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.macho.epididimo"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.macho?.epididimo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Conducto Deferente</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.macho.conductoDeferente"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.macho?.conductoDeferente || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prepucio</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.macho.prepucio"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.macho?.prepucio || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pene</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.macho.pene"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.macho?.pene || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Glándulas Accesorias</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaReproductor.macho.glandulasAccesorias"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.macho?.glandulasAccesorias || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        case 4:
          return (
            <>
              <h5>Sistema Nervioso</h5>
              <Form.Group className="mb-3">
                <Form.Label>Sensorio</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaNervioso.sensorio"
                  value={revisionMedica.mamiferos?.funcional?.sistemaNervioso?.sensorio || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Facies</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaNervioso.facies"
                  value={revisionMedica.mamiferos?.funcional?.sistemaNervioso?.facies || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Actitud</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sistemaNervioso.actitud"
                  value={revisionMedica.mamiferos?.funcional?.sistemaNervioso?.actitud || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tono Muscular</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.tonoMuscular"
                  value={revisionMedica.mamiferos?.funcional?.tonoMuscular || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Reacción Postural</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.reaccionPostural"
                  value={revisionMedica.mamiferos?.funcional?.reaccionPostural || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Reflejos</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.reflejos"
                  value={revisionMedica.mamiferos?.funcional?.reflejos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sensibilidad</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.sensibilidad"
                  value={revisionMedica.mamiferos?.funcional?.sensibilidad || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Trofismo Muscular</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.funcional.trofismoMuscular"
                  value={revisionMedica.mamiferos?.funcional?.trofismoMuscular || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Sistema Musculoesquelético</h5>
              <Form.Group className="mb-3">
                <Form.Label>Evaluación General</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="mamiferos.sistemaMusculoesqueletico"
                  value={revisionMedica.mamiferos?.sistemaMusculoesqueletico || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Sistema Endocrino</h5>
              <Form.Group className="mb-3">
                <Form.Label>Tiroides</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.sistemaEndocrino.tiroides"
                  value={revisionMedica.mamiferos?.sistemaEndocrino?.tiroides || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Paratiroides</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.sistemaEndocrino.paratiroides"
                  value={revisionMedica.mamiferos?.sistemaEndocrino?.paratiroides || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Adrenal</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.sistemaEndocrino.adrenal"
                  value={revisionMedica.mamiferos?.sistemaEndocrino?.adrenal || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hipófisis</Form.Label>
                <Form.Control
                  type="text"
                  name="mamiferos.sistemaEndocrino.hipofisis"
                  value={revisionMedica.mamiferos?.sistemaEndocrino?.hipofisis || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Diagnóstico</h5>
              <Form.Group className="mb-3">
                <Form.Label>Diagnóstico Presuntivo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="mamiferos.diagnostico.presuntivo"
                  value={revisionMedica.mamiferos?.diagnostico?.presuntivo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Diagnóstico Definitivo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="mamiferos.diagnostico.definitivo"
                  value={revisionMedica.mamiferos?.diagnostico?.definitivo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pronóstico</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="mamiferos.diagnostico.pronostico"
                  value={revisionMedica.mamiferos?.diagnostico?.pronostico || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Revisión de {tipoAnimal?.label}</h4>
        </div>
        {renderSubPageContent()}
      </>
    );
  };

  const renderAvesContent = () => {
    const renderSubPageContent = () => {
      switch (subPage) {
        case 1:
          return (
            <>
              <h5>Exploración General</h5>
              <Form.Group className="mb-3">
                <Form.Label>Motivo de Revisión</Form.Label>
                <Form.Select
                  name="aves.motivoRevision"
                  value={revisionMedica.aves?.motivoRevision || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="ingreso">Ingreso</option>
                  <option value="tratamiento">Tratamiento</option>
                  <option value="revisión anual">Revisión Anual</option>
                  <option value="expresión de patología">Expresión de Patología</option>
                  <option value="otro">Otro</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado Sensorio</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionGeneral.estadoSensorio"
                  value={revisionMedica.aves?.exploracionGeneral?.estadoSensorio || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Actitudes y Posturas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionGeneral.actitudesPosturas"
                  value={revisionMedica.aves?.exploracionGeneral?.actitudesPosturas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado de Nutrición</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionGeneral.estadoNutricion"
                  value={revisionMedica.aves?.exploracionGeneral?.estadoNutricion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado de Piel y Plumas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionGeneral.estadoPielPlumas"
                  value={revisionMedica.aves?.exploracionGeneral?.estadoPielPlumas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Coloración de Mucosas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionGeneral.coloracionMucosas"
                  value={revisionMedica.aves?.exploracionGeneral?.coloracionMucosas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nódulos Linfáticos</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionGeneral.nodulosLinfaticos"
                  value={revisionMedica.aves?.exploracionGeneral?.nodulosLinfaticos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado de Hidratación</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionGeneral.estadoHidratacion"
                  value={revisionMedica.aves?.exploracionGeneral?.estadoHidratacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Constantes Fisiológicas</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Temperatura (°C)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      name="aves.exploracionGeneral.constantesFisiologicas.temperatura"
                      value={revisionMedica.aves?.exploracionGeneral?.constantesFisiologicas?.temperatura || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia Cardíaca</Form.Label>
                    <Form.Control
                      type="number"
                      name="aves.exploracionGeneral.constantesFisiologicas.frecuenciaCardiaca"
                      value={revisionMedica.aves?.exploracionGeneral?.constantesFisiologicas?.frecuenciaCardiaca || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia Respiratoria</Form.Label>
                    <Form.Control
                      type="number"
                      name="aves.exploracionGeneral.constantesFisiologicas.frecuenciaRespiratoria"
                      value={revisionMedica.aves?.exploracionGeneral?.constantesFisiologicas?.frecuenciaRespiratoria || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tiempo Llenado Capilar</Form.Label>
                    <Form.Control
                      type="text"
                      name="aves.exploracionGeneral.constantesFisiologicas.tiempoLlenadoCapilar"
                      value={revisionMedica.aves?.exploracionGeneral?.constantesFisiologicas?.tiempoLlenadoCapilar || ''}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          );

        case 2:
          return (
            <>
              <h5>Exploración Particular - Piel y Plumaje</h5>
              <Form.Group className="mb-3">
                <Form.Label>Color de Plumas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.pielPlumaje.colorPlumas"
                  value={revisionMedica.aves?.exploracionParticular?.pielPlumaje?.colorPlumas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ectoparásitos</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.pielPlumaje.ectoparasitos"
                  value={revisionMedica.aves?.exploracionParticular?.pielPlumaje?.ectoparasitos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Heridas y Laceraciones</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.pielPlumaje.heridasLaceraciones"
                  value={revisionMedica.aves?.exploracionParticular?.pielPlumaje?.heridasLaceraciones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Glándula Uropígea</h6>
              <Form.Group className="mb-3">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.pielPlumaje.glandulaUropigia.color"
                  value={revisionMedica.aves?.exploracionParticular?.pielPlumaje?.glandulaUropigia?.color || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Secreción</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.pielPlumaje.glandulaUropigia.secrecion"
                  value={revisionMedica.aves?.exploracionParticular?.pielPlumaje?.glandulaUropigia?.secrecion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Cabeza y Cuello</h5>
              <h6>Pico</h6>
              <Form.Group className="mb-3">
                <Form.Label>Aspecto</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.pico.aspecto"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.pico?.aspecto || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Simetría</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.pico.simetria"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.pico?.simetria || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Consistencia</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.pico.consistencia"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.pico?.consistencia || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.pico.lesiones"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.pico?.lesiones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Narinas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Tamaño y Aspecto</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.narinas.tamanoAspecto"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.narinas?.tamanoAspecto || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Secreciones</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.narinas.secreciones"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.narinas?.secreciones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        case 3:
          return (
            <>
              <h5>Cabeza y Cuello (continuación)</h5>
              
              <h6>Cavidad Bucal</h6>
              <Form.Group className="mb-3">
                <Form.Label>Color de Mucosas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.cavidadBucal.colorMucosas"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.cavidadBucal?.colorMucosas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.cavidadBucal.lesiones"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.cavidadBucal?.lesiones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Ojos</h6>
              <Form.Group className="mb-3">
                <Form.Label>Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.ojos.lesiones"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.ojos?.lesiones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado de Hidratación</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.ojos.estadoHidratacion"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.ojos?.estadoHidratacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pupilas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.ojos.pupilas"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.ojos?.pupilas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Oídos</h6>
              <Form.Group className="mb-3">
                <Form.Label>Secreciones</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.oidos.secreciones"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.oidos?.secreciones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cuerpos Extraños</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.oidos.cuerposExtranos"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.oidos?.cuerposExtranos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ectoparásitos</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.oidos.ectoparasitos"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.oidos?.ectoparasitos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Esófago y Buche</h6>
              <Form.Group className="mb-3">
                <Form.Label>Palpación</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.esofagoBuche.palpacion"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.esofagoBuche?.palpacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contenido</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.esofagoBuche.contenido"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.esofagoBuche?.contenido || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Tráquea</h6>
              <Form.Group className="mb-3">
                <Form.Label>Palpación</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.traquea.palpacion"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.traquea?.palpacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Transluminación</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cabezaCuello.traquea.transluminacion"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.traquea?.transluminacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        case 4:
          return (
            <>
              <h5>Cuerpo</h5>
              <Form.Group className="mb-3">
                <Form.Label>Inspeccin (Heridas, laceraciones, inflamación)</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cuerpo.inspeccion"
                  value={revisionMedica.aves?.exploracionParticular?.cuerpo?.inspeccion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Palpación y Simetría</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cuerpo.palpacionSimetria"
                  value={revisionMedica.aves?.exploracionParticular?.cuerpo?.palpacionSimetria || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Músculos Pectorales</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cuerpo.musculosPectorales"
                  value={revisionMedica.aves?.exploracionParticular?.cuerpo?.musculosPectorales || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Abdomen</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cuerpo.abdomen"
                  value={revisionMedica.aves?.exploracionParticular?.cuerpo?.abdomen || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cloaca</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.cuerpo.cloaca"
                  value={revisionMedica.aves?.exploracionParticular?.cuerpo?.cloaca || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Extremidades</h5>
              <h6>Alas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Lesiones y Heridas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.alas.lesionesHeridas"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.lesionesHeridas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Simetría</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.alas.simetria"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.simetria || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fracturas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.alas.fracturas"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.fracturas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Plumas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Primarias</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.alas.plumas.primarias"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.plumas?.primarias || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Secundarias</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.alas.plumas.secundarias"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.plumas?.secundarias || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cobertoras</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.alas.plumas.cobertoras"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.plumas?.cobertoras || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prueba de Funcionalidad de Vuelo</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.alas.pruebaFuncionalidadVuelo"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.pruebaFuncionalidadVuelo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Miembros Inferiores</h6>
              <Form.Group className="mb-3">
                <Form.Label>Simetría</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.miembrosInferiores.simetria"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.miembrosInferiores?.simetria || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Lesiones y Heridas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.miembrosInferiores.lesionesHeridas"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.miembrosInferiores?.lesionesHeridas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fracturas</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.extremidades.miembrosInferiores.fracturas"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.miembrosInferiores?.fracturas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Capacidad de Mantenerse</h5>
              <Form.Group className="mb-3">
                <Form.Label>En Pie</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.capacidadDeMantenerse.enPie"
                  value={revisionMedica.aves?.exploracionParticular?.capacidadDeMantenerse?.enPie || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Caminar</Form.Label>
                <Form.Control
                  type="text"
                  name="aves.exploracionParticular.capacidadDeMantenerse.caminar"
                  value={revisionMedica.aves?.exploracionParticular?.capacidadDeMantenerse?.caminar || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Revisión de {tipoAnimal?.label}</h4>
        </div>
        {renderSubPageContent()}
      </>
    );
  };

  const renderReptilesContent = () => {
    const renderSubPageContent = () => {
      switch (subPage) {
        case 1:
          return (
            <>
              <h5>Inspección General</h5>
              <Form.Group className="mb-3">
                <Form.Label>Observación en Estado de Reposo</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionGeneral.observacionEstadoReposo"
                  value={revisionMedica.reptiles?.inspeccionGeneral?.observacionEstadoReposo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Deambulación</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionGeneral.deambulacion"
                  value={revisionMedica.reptiles?.inspeccionGeneral?.deambulacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado General Corporal/Caparazón</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionGeneral.estadoGeneralCorporalCaparazon"
                  value={revisionMedica.reptiles?.inspeccionGeneral?.estadoGeneralCorporalCaparazon || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Inspección y Palpación Particular</h5>
              <h6>Cabeza</h6>
              
              <h6>Ojos</h6>
              <Form.Group className="mb-3">
                <Form.Label>Brillo</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.ojos.brillo"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.brillo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Movilidad</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.ojos.movilidad"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.movilidad || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Grado de Hidratación</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.ojos.gradoHidratacion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.gradoHidratacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Reflejo Palpebral/Corneal</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.ojos.reflejoPalpebralCorneal"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.reflejoPalpebralCorneal || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Espéculo (Coloración)</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.ojos.especulo.coloracion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.especulo?.coloracion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Membranas Timpánicas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Aspecto</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.membranasTimpanicas.aspecto"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.membranasTimpanicas?.aspecto || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.membranasTimpanicas.lesiones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.membranasTimpanicas?.lesiones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Pico</h6>
              <Form.Group className="mb-3">
                <Form.Label>Crecimiento</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.pico.crecimiento"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.pico?.crecimiento || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Oclusión</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.pico.oclusion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.pico?.oclusion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Cavidad Bucal</h6>
              <Form.Group className="mb-3">
                <Form.Label>Brillo</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.cavidadBucal.brillo"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.brillo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Color de Mucosas</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.cavidadBucal.colorMucosas"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.colorMucosas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hidratación</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.cavidadBucal.hidratacion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.hidratacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Presencia de Lesiones/Secreciones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.cavidadBucal.presenciaLesionesSecreciones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.presenciaLesionesSecreciones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Narinas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Presencia de Secreciones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.narinas.presenciaSecreciones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.narinas?.presenciaSecreciones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Piel de la Cabeza</h6>
              <Form.Group className="mb-3">
                <Form.Label>Coloración y Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.piel.coloracionLesiones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.piel?.coloracionLesiones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Cuello</h5>
              <h6>Piel</h6>
              <Form.Group className="mb-3">
                <Form.Label>Presencia de Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.piel.presenciaLesiones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.presenciaLesiones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Coloración</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.piel.coloracion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.coloracion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Muda/Ecdisis</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.piel.mudaEcdisis"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.mudaEcdisis || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ectoparásitos</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.piel.ectoparasitos"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.ectoparasitos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Esófago y Tráquea</h6>
              <Form.Group className="mb-3">
                <Form.Label>Palpación</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.esofagoTraquea.palpacion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.esofagoTraquea?.palpacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        case 2:
          return (
            <>
              <h6>Membranas Timpánicas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Aspecto</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.membranasTimpanicas.aspecto"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.membranasTimpanicas?.aspecto || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.membranasTimpanicas.lesiones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.membranasTimpanicas?.lesiones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Pico</h6>
              <Form.Group className="mb-3">
                <Form.Label>Crecimiento</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.pico.crecimiento"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.pico?.crecimiento || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Oclusión</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.pico.oclusion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.pico?.oclusion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Cavidad Bucal</h6>
              <Form.Group className="mb-3">
                <Form.Label>Brillo</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.cavidadBucal.brillo"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.brillo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Color de Mucosas</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.cavidadBucal.colorMucosas"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.colorMucosas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hidratación</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.cavidadBucal.hidratacion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.hidratacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Presencia de Lesiones/Secreciones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.cavidadBucal.presenciaLesionesSecreciones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.presenciaLesionesSecreciones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Narinas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Presencia de Secreciones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.narinas.presenciaSecreciones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.narinas?.presenciaSecreciones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Piel de la Cabeza</h6>
              <Form.Group className="mb-3">
                <Form.Label>Coloración y Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cabeza.piel.coloracionLesiones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.piel?.coloracionLesiones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Cuello</h5>
              <h6>Piel</h6>
              <Form.Group className="mb-3">
                <Form.Label>Presencia de Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.piel.presenciaLesiones"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.presenciaLesiones || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Coloración</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.piel.coloracion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.coloracion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Muda/Ecdisis</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.piel.mudaEcdisis"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.mudaEcdisis || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ectoparásitos</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.piel.ectoparasitos"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.ectoparasitos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Esófago y Tráquea</h6>
              <Form.Group className="mb-3">
                <Form.Label>Palpación</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cuello.esofagoTraquea.palpacion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.esofagoTraquea?.palpacion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        case 3:
          return (
            <>
              <h5>Miembros</h5>
              <h6>Anteriores y Posteriores</h6>
              <Form.Group className="mb-3">
                <Form.Label>Fracturas</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.anterioresPosteriores.fracturas"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.anterioresPosteriores?.fracturas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Alteración de Ejes</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.anterioresPosteriores.alteracionEjes"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.anterioresPosteriores?.alteracionEjes || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Piel y Escamas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Heridas</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.pielEscamas.heridas"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.pielEscamas?.heridas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Presencia de Ectoparásitos</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.pielEscamas.presenciaEctoparasitos"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.pielEscamas?.presenciaEctoparasitos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ecdisis</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.pielEscamas.ecdisis"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.pielEscamas?.ecdisis || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Uñas</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.unas"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.unas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Musculatura</h6>
              <Form.Group className="mb-3">
                <Form.Label>Funcionalidad</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.musculatura.funcionalidad"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.musculatura?.funcionalidad || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Movilidad</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.musculatura.movilidad"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.musculatura?.movilidad || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Flexión/Extensión Forzadas</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.musculatura.flexionExtensionForzadas"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.musculatura?.flexionExtensionForzadas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Reflejo de Retirada</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.miembros.musculatura.reflejoRetirada"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.musculatura?.reflejoRetirada || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        case 4:
          return (
            <>
              <h5>Caparazón</h5>
              <h6>Inspección</h6>
              <Form.Group className="mb-3">
                <Form.Label>Tamaño</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.inspeccion.tamano"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.inspeccion?.tamano || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Forma</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.inspeccion.forma"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.inspeccion?.forma || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.inspeccion.color"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.inspeccion?.color || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Integridad</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.inspeccion.integridad"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.inspeccion?.integridad || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Escudos/Anillos Córneos</h6>
              <Form.Group className="mb-3">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.escudosAnillosCorneos.color"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.escudosAnillosCorneos?.color || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Simetría</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.escudosAnillosCorneos.simetria"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.escudosAnillosCorneos?.simetria || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Integridad</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.escudosAnillosCorneos.integridad"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.escudosAnillosCorneos?.integridad || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Número de Escudos</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.escudosAnillosCorneos.numeroEscudos"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.escudosAnillosCorneos?.numeroEscudos || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Espalda/Peto</h6>
              <Form.Group className="mb-3">
                <Form.Label>Inspección y Simetría</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.espaldaPeto.inspeccionSimetria"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.espaldaPeto?.inspeccionSimetria || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Palpación y Presión</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.espaldaPeto.palpacionPresion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.espaldaPeto?.palpacionPresion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Percusión Área Pulmonar</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.caparazon.espaldaPeto.percusionAreaPulmonar"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.espaldaPeto?.percusionAreaPulmonar || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        case 5:
          return (
            <>
              <h5>Quelonios</h5>
              <h6>Cavidad Celómica</h6>
              <Form.Group className="mb-3">
                <Form.Label>Fosas Axilares e Inguinales</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.quelonios.cavidadCelomica.fosasAxilaresInguinales"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.quelonios?.cavidadCelomica?.fosasAxilaresInguinales || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Palpación Profunda</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.quelonios.cavidadCelomica.palpacionProfunda"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.quelonios?.cavidadCelomica?.palpacionProfunda || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Auscultación Fosa Inguinal</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.quelonios.cavidadCelomica.auscultacion.fosaInguinal"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.quelonios?.cavidadCelomica?.auscultacion?.fosaInguinal || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Lagartos/Iguanas</h5>
              <h6>Piel</h6>
              <Form.Group className="mb-3">
                <Form.Label>Inspección Frecuencia/Tipo Respiración</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.lagartosIguanas.piel.inspeccionFrecuenciaTipoRespiracion"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.piel?.inspeccionFrecuenciaTipoRespiracion || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Presencia Heridas/Abscesos/Disecdisis</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.lagartosIguanas.piel.presenciaHeridasAbscesosDisecdisis"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.piel?.presenciaHeridasAbscesosDisecdisis || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Reflejo Panículo Cutáneo</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.lagartosIguanas.piel.reflejoPaniculoCutaneo"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.piel?.reflejoPaniculoCutaneo || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Cavidad Celómica</h6>
              <Form.Group className="mb-3">
                <Form.Label>Palpación Profunda</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.lagartosIguanas.cavidadCelomica.palpacionProfunda"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.cavidadCelomica?.palpacionProfunda || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Auscultación Área Pulmonar</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.lagartosIguanas.cavidadCelomica.auscultacionAreaPulmonar"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.cavidadCelomica?.auscultacionAreaPulmonar || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Auscultación Área Cardíaca</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.lagartosIguanas.cavidadCelomica.auscultacionAreaCardiaca"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.cavidadCelomica?.auscultacionAreaCardiaca || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Cloaca y Apéndice Caudal</h5>
              <Form.Group className="mb-3">
                <Form.Label>Inspección Piel/Apertura</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cloacaApendiceCaudal.inspeccionPielApertura"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cloacaApendiceCaudal?.inspeccionPielApertura || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h6>Palpación</h6>
              <Form.Group className="mb-3">
                <Form.Label>Tono Muscular</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cloacaApendiceCaudal.palpacion.tonoMuscular"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cloacaApendiceCaudal?.palpacion?.tonoMuscular || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contenido</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.cloacaApendiceCaudal.palpacion.contenido"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cloacaApendiceCaudal?.palpacion?.contenido || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <h5>Sexaje</h5>
              <h6>Inspección</h6>
              <Form.Group className="mb-3">
                <Form.Label>Pene (Quelonios)</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.sexaje.inspeccion.peneQuelonios"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.sexaje?.inspeccion?.peneQuelonios || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hemipenes (Escamados)</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.sexaje.inspeccion.hemipenesEscamados"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.sexaje?.inspeccion?.hemipenesEscamados || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Coloración Mucosas</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.sexaje.coloracionMucosas"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.sexaje?.coloracionMucosas || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado Piel/Movilidad Apéndice Caudal/Cola</Form.Label>
                <Form.Control
                  type="text"
                  name="reptiles.inspeccionPalpacionParticular.sexaje.apendiceCaudalCola.estadoPielMovilidad"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.sexaje?.apendiceCaudalCola?.estadoPielMovilidad || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Revisión de {tipoAnimal?.label}</h4>
        </div>
        {renderSubPageContent()}
      </>
    );
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Animal</Form.Label>
              <Select
                options={opcionesTipoAnimal}
                value={tipoAnimal}
                onChange={handleTipoAnimalChange}
                placeholder="Seleccione el tipo de animal"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de Revisión</Form.Label>
              <Form.Control
                type="date"
                name="fechaRevision"
                value={revisionMedica.fechaRevision}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Veterinario</Form.Label>
              <Form.Control
                type="text"
                name="veterinario"
                value={revisionMedica.veterinario}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        );

      case 2:
        switch (tipoAnimal?.value) {
          case 'Mamiferos':
            return renderMamiferosContent();
          case 'Aves':
            return renderAvesContent();
          case 'Reptiles':
            return renderReptilesContent();
          default:
            return null;
        }

      case 3:
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Observaciones Generales</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observacionesGenerales"
                value={revisionMedica.observacionesGenerales}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Archivos Adjuntos</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </Form.Group>
          </>
        );

      default:
        return null;
    }
  };

  const opcionesTipoAnimal = [
    { value: 'Mamiferos', label: 'Mamíferos' },
    { value: 'Aves', label: 'Aves' },
    { value: 'Reptiles', label: 'Reptiles' }
  ];

  const opcionesMotivo = [
    { value: 'ingreso', label: 'Ingreso' },
    { value: 'tratamiento', label: 'Tratamiento' },
    { value: 'revisión anual', label: 'Revisión Anual' },
    { value: 'expresión de patología', label: 'Expresión de Patología' },
    { value: 'otro', label: 'Otro' }
  ];

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {currentPage === 1 && "Agregar Revisión Médica"}
          {currentPage === 2 && tipoAnimal && (
            `Revisión de ${tipoAnimal.value === 'Mamiferos' ? 'Mamíferos' :
              tipoAnimal.value === 'Aves' ? 'Aves' :
                'Reptiles'}`
          )}
          {currentPage === 3 && "Observaciones y Archivos"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {renderPageContent()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          
          {(currentPage > 1 || subPage > 1) && (
            <Button
              variant="outline-primary"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage === 2 && subPage > 1) {
                  setSubPage(prev => prev - 1);
                } else {
                  handlePrevPage();
                }
              }}
            >
              Anterior
            </Button>
          )}

          {currentPage < 3 ? (
            <Button
              variant="primary"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage === 2) {
                  const maxSubPages = 
                    tipoAnimal?.value === 'Mamiferos' ? 4 :
                    tipoAnimal?.value === 'Aves' ? 4 : 5;

                  if (subPage < maxSubPages) {
                    setSubPage(prev => prev + 1);
                  } else {
                    handleNextPage();
                  }
                } else {
                  handleNextPage();
                }
              }}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Revisión'}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddRevisionMedicaModal;
