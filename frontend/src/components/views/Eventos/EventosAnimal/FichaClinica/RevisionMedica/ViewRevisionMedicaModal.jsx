import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Calendar, User, FileText, Activity, Stethoscope } from 'lucide-react';
import './ViewRevisionMedicaModal.css';

const ViewRevisionMedicaModal = ({ show, handleClose, revisionMedicaId }) => {
  const [revisionMedica, setRevisionMedica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('informacion');
  const [subPage, setSubPage] = useState(1);

  useEffect(() => {
    if (show && revisionMedicaId) {
      fetchRevisionMedica();
    }
  }, [show, revisionMedicaId]);

  const fetchRevisionMedica = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}revision-medica/${revisionMedicaId}`);
      setRevisionMedica(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener la revisión médica:', error);
      setError('Error al cargar la revisión médica');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Esto devolverá el formato YYYY-MM-DD
  };

  const renderMamiferosContent = () => {
    switch (activeTab) {
      case 'informacion':
        return (
          <div className="info-section">
            <h5 className="section-title">
              <Calendar size={18} />
              Información General
            </h5>
            <div className="info-content">
              <div className="info-item">
                <label>Fecha de Revisión</label>
                <p>{formatDate(revisionMedica?.fechaRevision)}</p>
              </div>
              <div className="info-item">
                <label>Veterinario</label>
                <p>{revisionMedica?.veterinario}</p>
              </div>
            </div>
          </div>
        );

      case 'examenGeneral':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Constantes Fisiológicas</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Temperatura (°C)</Form.Label>
                    <Form.Control
                      type="text"
                      value={revisionMedica.mamiferos?.examenObjetivoGeneral?.constantesFisiologicas?.temperatura || ''}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia Cardíaca</Form.Label>
                    <Form.Control
                      type="text"
                      value={revisionMedica.mamiferos?.examenObjetivoGeneral?.constantesFisiologicas?.frecuenciaCardiaca || ''}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia Respiratoria</Form.Label>
                    <Form.Control
                      type="text"
                      value={revisionMedica.mamiferos?.examenObjetivoGeneral?.constantesFisiologicas?.frecuenciaRespiratoria || ''}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group className="mb-3">
                <Form.Label>Tiempo de Llenado Capilar</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.constantesFisiologicas?.tiempoLlenadoCapilar || ''}
                  readOnly
                />
              </Form.Group>
                </Col>
              </Row>

              <h5>Estado General</h5>
              <Form.Group className="mb-3">
                <Form.Label>Estado de Nutrición</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.estadoNutricion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado de Hidratación (%)</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.estadoHidratacion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pulso</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.pulso || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Actitud</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaNervioso?.actitud || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado Sensorio</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.estadoSensorio || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fascia</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.fascia || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Actitudes y Posturas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.examenObjetivoGeneral?.actitudesPosturas || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'sistemas':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Sistema Digestivo</h5>
              <Form.Group className="mb-3">
                <Form.Label>Recto</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.recto || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ano</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaDigestivo?.ano || ''}
                  readOnly
                />
              </Form.Group>

              <h5>Sistema Urinario</h5>
              <Form.Group className="mb-3">
                <Form.Label>Riñones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaUrinario?.rinones || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Vejiga</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaUrinario?.vejiga || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Uretra</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaUrinario?.uretra || ''}
                  readOnly
                />
              </Form.Group>

              <h5>Sistema Reproductor</h5>
              <h6>Hembra</h6>
              <Form.Group className="mb-3">
                <Form.Label>Vulva</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.vulva || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Vestíbulo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.vestibulo || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Vagina</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.vagina || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Útero</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.utero || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ovarios</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.hembra?.ovarios || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Macho</h6>
              <Form.Group className="mb-3">
                <Form.Label>Escroto</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaReproductor?.macho?.escroto || ''}
                  readOnly
                />
              </Form.Group>
              {/* ... continúa con todos los campos del macho ... */}

              <h5>Sistema Nervioso</h5>
              <Form.Group className="mb-3">
                <Form.Label>Sensorio</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaNervioso?.sensorio || ''}
                  readOnly
                />
              </Form.Group>
              {/* ... continúa con todos los campos del sistema nervioso ... */}

              <h5>Sistema Musculoesquelético</h5>
              <Form.Group className="mb-3">
                <Form.Label>Evaluación General</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={revisionMedica.mamiferos?.sistemaMusculoesqueletico || ''}
                  readOnly
                />
              </Form.Group>

              <h5>Sistema Endocrino</h5>
              <Form.Group className="mb-3">
                <Form.Label>Tiroides</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.sistemaEndocrino?.tiroides || ''}
                  readOnly
                />
              </Form.Group>
              {/* ... continúa con todos los campos del sistema endocrino ... */}

              <h5>Sistema Respiratorio</h5>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.descripcion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Frecuencia Respiratoria y Ritmo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.frecuenciaRespiratoriaRitmo || ''}
                  readOnly
                />
              </Form.Group>

              <h5>Evaluación Funcional</h5>
              <Form.Group className="mb-3">
                <Form.Label>Tono Muscular</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.tonoMuscular || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'topografico':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Cabeza y Cuello</h5>
              <Form.Group className="mb-3">
                <Form.Label>Pupilas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.cabezaCuello?.pupilas || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cavidad Bucal</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.cabezaCuello?.cavidadBucal || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Piezas Dentarias</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.cabezaCuello?.piezasDentarias || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Oídos</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.cabezaCuello?.oidos || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Resto del Cuerpo</h6>
              <Form.Group className="mb-3">
                <Form.Label>Tórax</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.torax || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Abdomen</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.abdomen || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Aparatos</h6>
              <Form.Group className="mb-3">
                <Form.Label>Aparato Urinario Reproductor</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.topografico?.aparatoUrinarioReproductor || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Sistema Respiratorio</h6>
              <Form.Group className="mb-3">
                <Form.Label>Tráquea</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.traquea || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tórax y Área Pulmonar</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaRespiratorio?.toraxAreaPulmonar || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Sistema Cardiovascular</h6>
              <Form.Group className="mb-3">
                <Form.Label>Inspección</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.inspeccion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Auscultación</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.funcional?.sistemaCardiovascular?.auscultacion || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'diagnostico':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Diagnóstico</h5>
              <Form.Group className="mb-3">
                <Form.Label>Diagnóstico Presuntivo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.diagnostico?.presuntivo || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Diagnóstico Definitivo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.diagnostico?.definitivo || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pronóstico</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.mamiferos?.diagnostico?.pronostico || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderAvesContent = () => {
    switch (activeTab) {
      case 'pielPlumaje':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5 className="section-title">
                <Activity size={18} />
                Piel y Plumaje
              </h5>
              <Form.Group className="mb-3">
                <Form.Label>Secreción</Form.Label>
                <p className="info-value">
                  {revisionMedica.aves?.exploracionParticular?.pielPlumaje?.glandulaUropigia?.secrecion || ''}
                </p>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Color Plumas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.pielPlumaje?.colorPlumas || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ectoparásitos</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.pielPlumaje?.ectoparasitos || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Heridas/Laceraciones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.pielPlumaje?.heridasLaceraciones || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'cabeza':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5 className="section-title">
                <Activity size={18} />
                Pico
              </h5>
              <Form.Group className="mb-3">
                <Form.Label>Aspecto</Form.Label>
                <p className="info-value">
                  {revisionMedica.aves?.exploracionParticular?.cabezaCuello?.pico?.aspecto || ''}
                </p>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Simetría</Form.Label>
                <p className="info-value">
                  {revisionMedica.aves?.exploracionParticular?.cabezaCuello?.pico?.simetria || ''}
                </p>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Consistencia</Form.Label>
                <p className="info-value">
                  {revisionMedica.aves?.exploracionParticular?.cabezaCuello?.pico?.consistencia || ''}
                </p>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Lesiones</Form.Label>
                <p className="info-value">
                  {revisionMedica.aves?.exploracionParticular?.cabezaCuello?.pico?.lesiones || ''}
                </p>
              </Form.Group>

              <h6>Narinas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Tamaño y Aspecto</Form.Label>
                <p className="info-value">
                  {revisionMedica.aves?.exploracionParticular?.cabezaCuello?.narinas?.tamanoAspecto || ''}
                </p>
              </Form.Group>

              <h6>Cavidad Bucal</h6>
              <Form.Group className="mb-3">
                <Form.Label>Color de Mucosas</Form.Label>
                <p className="info-value">
                  {revisionMedica.aves?.exploracionParticular?.cabezaCuello?.cavidadBucal?.colorMucosas || ''}
                </p>
              </Form.Group>

              <Form.Label>Secreciones</Form.Label>
              <Form.Control
                type="text"
                value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.narinas?.secreciones || ''}
                readOnly
              />

              <h6>Lesiones</h6>
              <Form.Group className="mb-3">
                <Form.Label>Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.cavidadBucal?.lesiones || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Ojos</h6>
              <Form.Group className="mb-3">
                <Form.Label>Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.ojos?.lesiones || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado Hidratación</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.ojos?.estadoHidratacion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pupilas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.ojos?.pupilas || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Oídos</h6>
              <Form.Group className="mb-3">
                <Form.Label>Secreciones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.oidos?.secreciones || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cuerpos Extraños</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.oidos?.cuerposExtranos || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ectoparásitos</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.oidos?.ectoparasitos || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Esófago y Buche</h6>
              <Form.Group className="mb-3">
                <Form.Label>Palpación</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.esofagoBuche?.palpacion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contenido</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.esofagoBuche?.contenido || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Tráquea</h6>
              <Form.Group className="mb-3">
                <Form.Label>Palpación</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.traquea?.palpacion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Transluminación</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.cabezaCuello?.traquea?.transluminacion || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'extremidades':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Alas</h5>
              <h6>Plumas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Primarias</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.plumas?.primarias || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Secundarias</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.plumas?.secundarias || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cobertoras</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.plumas?.cobertoras || ''}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Lesiones/Heridas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.lesionesHeridas || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Simetría</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.simetria || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fracturas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.fracturas || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Prueba Funcionalidad Vuelo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.alas?.pruebaFuncionalidadVuelo || ''}
                  readOnly
                />
              </Form.Group>

              <h5>Miembros Inferiores</h5>
              <Form.Group className="mb-3">
                <Form.Label>Simetría</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.miembrosInferiores?.simetria || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Lesiones/Heridas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.miembrosInferiores?.lesionesHeridas || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fracturas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.extremidades?.miembrosInferiores?.fracturas || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'capacidadMantenerse':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Capacidad de Mantenerse</h5>
              <Form.Group className="mb-3">
                <Form.Label>En Pie</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.capacidadDeMantenerse?.enPie || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Caminar</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.aves?.exploracionParticular?.capacidadDeMantenerse?.caminar || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'diagnostico':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5 className="section-title">
                <Activity size={18} />
                Diagnóstico
              </h5>
              <Form.Group className="mb-3">
                <Form.Label>Diagnóstico Presuntivo</Form.Label>
                <p className="info-value">
                  {revisionMedica.aves?.diagnostico?.presuntivo || ''}
                </p>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Diagnóstico Diferencial</Form.Label>
                <p className="info-value">
                  {revisionMedica.aves?.diagnostico?.diferencial || ''}
                </p>
              </Form.Group>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderReptilesContent = () => {
    switch (activeTab) {
      case 'inspeccionGeneral':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Inspección General</h5>
              <Form.Group className="mb-3">
                <Form.Label>Observación Estado Reposo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionGeneral?.observacionEstadoReposo || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deambulación</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionGeneral?.deambulacion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado General Corporal/Caparazón</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionGeneral?.estadoGeneralCorporalCaparazon || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'cabezaCuello':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Cabeza</h5>
              <h6>Ojos</h6>
              <Form.Group className="mb-3">
                <Form.Label>Coloración Espéculo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.especulo?.coloracion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Brillo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.brillo || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Movilidad</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.movilidad || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Grado Hidratación</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.gradoHidratacion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Reflejo Palpebral Corneal</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.ojos?.reflejoPalpebralCorneal || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Membranas Timpánicas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Aspecto</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.membranasTimpanicas?.aspecto || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.membranasTimpanicas?.lesiones || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Pico</h6>
              <Form.Group className="mb-3">
                <Form.Label>Crecimiento</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.pico?.crecimiento || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Oclusión</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.pico?.oclusion || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Cavidad Bucal</h6>
              <Form.Group className="mb-3">
                <Form.Label>Brillo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.brillo || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Color Mucosas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.colorMucosas || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hidratación</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.hidratacion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Presencia Lesiones/Secreciones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.cavidadBucal?.presenciaLesionesSecreciones || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Narinas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Presencia Secreciones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.narinas?.presenciaSecreciones || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Piel de la Cabeza</h6>
              <Form.Group className="mb-3">
                <Form.Label>Coloración y Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cabeza?.piel?.coloracionLesiones || ''}
                  readOnly
                />
              </Form.Group>

              <h5>Cuello</h5>
              <h6>Piel</h6>
              <Form.Group className="mb-3">
                <Form.Label>Presencia Lesiones</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.presenciaLesiones || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Coloración</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.coloracion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Muda/Ecdisis</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.mudaEcdisis || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ectoparásitos</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.piel?.ectoparasitos || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Esófago y Tráquea</h6>
              <Form.Group className="mb-3">
                <Form.Label>Palpación</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cuello?.esofagoTraquea?.palpacion || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'miembrosCaparazon':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Miembros</h5>
              <h6>Anteriores y Posteriores</h6>
              <Form.Group className="mb-3">
                <Form.Label>Fracturas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.anterioresPosteriores?.fracturas || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Alteración Ejes</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.anterioresPosteriores?.alteracionEjes || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Piel y Escamas</h6>
              <Form.Group className="mb-3">
                <Form.Label>Heridas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.pielEscamas?.heridas || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Presencia Ectoparásitos</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.pielEscamas?.presenciaEctoparasitos || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ecdisis</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.pielEscamas?.ecdisis || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Musculatura</h6>
              <Form.Group className="mb-3">
                <Form.Label>Funcionalidad</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.musculatura?.funcionalidad || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Movilidad</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.musculatura?.movilidad || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Flexión/Extensión Forzadas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.musculatura?.flexionExtensionForzadas || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Reflejo Retirada</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.musculatura?.reflejoRetirada || ''}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Uñas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.miembros?.unas || ''}
                  readOnly
                />
              </Form.Group>

              <h5>Caparazón</h5>
              <h6>Inspección</h6>
              <Form.Group className="mb-3">
                <Form.Label>Tamaño</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.inspeccion?.tamano || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Forma</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.inspeccion?.forma || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.inspeccion?.color || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Integridad</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.inspeccion?.integridad || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Escudos/Anillos Córneos</h6>
              <Form.Group className="mb-3">
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.escudosAnillosCorneos?.color || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Simetría</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.escudosAnillosCorneos?.simetria || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Integridad</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.escudosAnillosCorneos?.integridad || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Número Escudos</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.escudosAnillosCorneos?.numeroEscudos || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Espalda/Peto</h6>
              <Form.Group className="mb-3">
                <Form.Label>Inspección Simetría</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.espaldaPeto?.inspeccionSimetria || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Palpación Presión</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.espaldaPeto?.palpacionPresion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Percusión Área Pulmonar</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.caparazon?.espaldaPeto?.percusionAreaPulmonar || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'especiesEspecificas':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Quelonios</h5>
              <h6>Cavidad Celómica</h6>
              <Form.Group className="mb-3">
                <Form.Label>Auscultación Fosa Inguinal</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.quelonios?.cavidadCelomica?.auscultacion?.fosaInguinal || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fosas Axilares/Inguinales</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.quelonios?.cavidadCelomica?.fosasAxilaresInguinales || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Palpación Profunda</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.quelonios?.cavidadCelomica?.palpacionProfunda || ''}
                  readOnly
                />
              </Form.Group>

              <h5>Lagartos e Iguanas</h5>
              <h6>Piel</h6>
              <Form.Group className="mb-3">
                <Form.Label>Inspección Frecuencia/Tipo Respiración</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.piel?.inspeccionFrecuenciaTipoRespiracion || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Presencia Heridas/Abscesos/Disecdisis</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.piel?.presenciaHeridasAbscesosDisecdisis || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Reflejo Panículo Cutáneo</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.piel?.reflejoPaniculoCutaneo || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Cavidad Celómica</h6>
              <Form.Group className="mb-3">
                <Form.Label>Palpación Profunda</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.cavidadCelomica?.palpacionProfunda || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Auscultación Área Pulmonar</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.cavidadCelomica?.auscultacionAreaPulmonar || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Auscultación Área Cardíaca</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.lagartosIguanas?.cavidadCelomica?.auscultacionAreaCardiaca || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      case 'cloacaSexaje':
        return (
          <div className="info-grid">
            <div className="info-section">
              <h5>Cloaca y Apéndice Caudal</h5>
              <h6>Palpación</h6>
              <Form.Group className="mb-3">
                <Form.Label>Tono Muscular</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cloacaApendiceCaudal?.palpacion?.tonoMuscular || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contenido</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cloacaApendiceCaudal?.palpacion?.contenido || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Inspección Piel/Apertura</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.cloacaApendiceCaudal?.inspeccionPielApertura || ''}
                  readOnly
                />
              </Form.Group>

              <h5>Sexaje</h5>
              <h6>Inspección</h6>
              <Form.Group className="mb-3">
                <Form.Label>Pene Quelonios</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.sexaje?.inspeccion?.peneQuelonios || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hemipenes Escamados</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.sexaje?.inspeccion?.hemipenesEscamados || ''}
                  readOnly
                />
              </Form.Group>

              <h6>Apéndice Caudal/Cola</h6>
              <Form.Group className="mb-3">
                <Form.Label>Estado Piel/Movilidad</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.sexaje?.apendiceCaudalCola?.estadoPielMovilidad || ''}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Coloración Mucosas</Form.Label>
                <Form.Control
                  type="text"
                  value={revisionMedica.reptiles?.inspeccionPalpacionParticular?.sexaje?.coloracionMucosas || ''}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    if (activeTab === 'informacion') {
      return (
        <div className="info-section">
          <h5 className="section-title">
            <Calendar size={18} />
            Información General
          </h5>
          <div className="info-content">
            <div className="info-item">
              <label>Fecha de Revisión</label>
              <p>{formatDate(revisionMedica?.fechaRevision)}</p>
            </div>
            <div className="info-item">
              <label>Veterinario</label>
              <p>{revisionMedica?.veterinario}</p>
            </div>
            <div className="info-item">
              <label>Tipo de Animal</label>
              <p>{revisionMedica?.tipoRevision}</p>
            </div>
          </div>
        </div>
      );
    }

    switch (revisionMedica?.tipoRevision) {
      case 'Aves':
        return renderAvesContent();
      case 'Mamiferos':
        return renderMamiferosContent();
      case 'Reptiles':
        return renderReptilesContent();
      default:
        return null;
    }
  };

  const getTabsForAnimalType = () => {
    switch (revisionMedica?.tipoRevision) {
      case 'Aves':
        return [
          { id: 'informacion', label: 'Información General', icon: Calendar },
          { id: 'pielPlumaje', label: 'Piel y Plumaje', icon: Activity },
          { id: 'cabeza', label: 'Cabeza', icon: Activity },
          { id: 'extremidades', label: 'Extremidades', icon: Activity },
          { id: 'capacidadMantenerse', label: 'Capacidad de Mantenerse', icon: Activity },
          { id: 'diagnostico', label: 'Diagnóstico', icon: Activity }
        ];
      case 'Mamiferos':
        return [
          { id: 'informacion', label: 'Información General', icon: Calendar },
          { id: 'examenGeneral', label: 'Examen General', icon: Activity },
          { id: 'sistemas', label: 'Sistemas', icon: Activity },
          { id: 'topografico', label: 'Topográfico', icon: Activity },
          { id: 'diagnostico', label: 'Diagnóstico', icon: Activity }
        ];
      case 'Reptiles':
        return [
          { id: 'informacion', label: 'Información General', icon: Calendar },
          { id: 'inspeccionGeneral', label: 'Inspección General', icon: Activity },
          { id: 'cabezaCuello', label: 'Cabeza y Cuello', icon: Activity },
          { id: 'miembrosCaparazon', label: 'Miembros y Caparazón', icon: Activity },
          { id: 'especiesEspecificas', label: 'Especies Específicas', icon: Activity },
          { id: 'cloacaSexaje', label: 'Cloaca y Sexaje', icon: Activity }
        ];
      default:
        return [
          { id: 'informacion', label: 'Información General', icon: Calendar }
        ];
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg"
      className="revision-medica-modal"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <Stethoscope size={24} className="me-2" />
          Revisión Médica - {revisionMedica?.tipoRevision || ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="animal-type-indicator">
          Tipo de Animal: <span className="badge bg-info">{revisionMedica?.tipoRevision}</span>
        </div>
        
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="revision-content">
            <ul className="nav nav-tabs">
              {getTabsForAnimalType().map(tab => (
                <li className="nav-item" key={tab.id}>
                  <button 
                    className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="tab-content">
              {renderContent()}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewRevisionMedicaModal;
