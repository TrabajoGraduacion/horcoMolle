import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Table, Card, Badge, ProgressBar } from 'react-bootstrap';
import { 
  Clock, 
  Thermometer, 
  Activity, 
  Heart, 
  Droplet, 
  FileText, 
  User,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Wind,
  Zap,
  MessageSquare,
  Bed,
  Ruler,
  Timer,
  Stethoscope,
  Brain,
  PersonStanding,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ViewAnestesiaModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faThermometer,
  faUser,
  faClock,
  faDroplet,
  faSyringe,
  faHeartbeat,
  faCheckCircle,
  faFile,
  faNotesMedical,
  faClipboardQuestion,
  faHandHoldingMedical,
  faClipboardList,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileAlt,
  faFileVideo,
  faFileAudio,
  faFileArchive,
  faFileCode
} from '@fortawesome/free-solid-svg-icons';

const ViewAnestesiaModal = ({ show, handleClose, anestesiaId }) => {
  const [anestesia, setAnestesia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && anestesiaId) {
      fetchAnestesia();
    }
  }, [show, anestesiaId]);

  const fetchAnestesia = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}anestesia/${anestesiaId}`);
      setAnestesia(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener la anestesia:', error);
      setError('Error al cargar la anestesia');
    } finally {
      setLoading(false);
    }
  };

  // Estilos mejorados
  const titleStyle = {
    color: '#2C5282',
    borderBottom: '2px solid #70AA68',
    paddingBottom: '12px',
    marginBottom: '25px',
    fontSize: '1.6rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const sectionStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
    border: '1px solid #e0e0e0'
  };

  const infoCardStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #e9ecef'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    height: '100%',
    border: '1px solid #e9ecef',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)'
    }
  };

  const labelStyle = {
    color: '#4A5568',
    fontWeight: '600',
    fontSize: '0.95rem',
    marginBottom: '5px'
  };

  const valueStyle = {
    color: '#2D3748',
    fontSize: '0.95rem',
    backgroundColor: '#f8f9fa',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e9ecef'
  };

  // Funciones helper
  const getTipoDroga = (tipo) => {
    const tipos = {
      'T': 'Tranquilizante',
      'I': 'Inmovilizante',
      'S': 'Suplemento',
      'M': 'Mantenimiento',
      'A': 'Antagonista',
      'O': 'Otros'
    };
    return tipos[tipo] || tipo;
  };

  const getMedioVia = (via) => {
    const vias = {
      'J': 'Jeringa',
      'C': 'Cerbatana',
      'D': 'Dardo',
      'B': 'Bater',
      'R': 'Rifle',
      'IM': 'Intramuscular',
      'SC': 'Subcutánea',
      'EV': 'Endovenosa',
      'IN': 'Intranasal'
    };
    return vias[via] || via;
  };

  const getExitoAplicacion = (exito) => {
    const exitos = {
      'T': 'Total',
      'P': 'Parcial',
      'N': 'Ninguno'
    };
    return exitos[exito] || exito;
  };

  const getEfectoColor = (efecto) => {
    const efectos = {
      0: { color: 'secondary', label: 'Ninguno' },
      1: { color: 'info', label: 'Ligero' },
      2: { color: 'primary', label: 'Moderado' },
      3: { color: 'warning', label: 'Profundo' },
      4: { color: 'danger', label: 'Excesivo/prof' },
      5: { color: 'dark', label: 'Deceso' }
    };
    return efectos[efecto] || { color: 'secondary', label: 'No especificado' };
  };

  const getRetornoColor = (tipo) => {
    const colores = {
      'Normal': 'success',
      'Prolongado': 'warning',
      'Deceso': 'danger'
    };
    return colores[tipo] || 'secondary';
  };

  const getFileIcon = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    
    const iconMap = {
      // Documentos
      'pdf': { icon: faFilePdf, color: '#DC2626' },
      'doc': { icon: faFileWord, color: '#2563EB' },
      'docx': { icon: faFileWord, color: '#2563EB' },
      'xls': { icon: faFileExcel, color: '#059669' },
      'xlsx': { icon: faFileExcel, color: '#059669' },
      'ppt': { icon: faFilePowerpoint, color: '#DB2777' },
      'pptx': { icon: faFilePowerpoint, color: '#DB2777' },
      
      // Imágenes
      'jpg': { icon: faFileImage, color: '#7C3AED' },
      'jpeg': { icon: faFileImage, color: '#7C3AED' },
      'png': { icon: faFileImage, color: '#7C3AED' },
      'gif': { icon: faFileImage, color: '#7C3AED' },
      'svg': { icon: faFileImage, color: '#7C3AED' },
      
      // Video
      'mp4': { icon: faFileVideo, color: '#9D174D' },
      'mov': { icon: faFileVideo, color: '#9D174D' },
      'avi': { icon: faFileVideo, color: '#9D174D' },
      
      // Audio
      'mp3': { icon: faFileAudio, color: '#5B21B6' },
      'wav': { icon: faFileAudio, color: '#5B21B6' },
      
      // Comprimidos
      'zip': { icon: faFileArchive, color: '#B45309' },
      'rar': { icon: faFileArchive, color: '#B45309' },
      '7z': { icon: faFileArchive, color: '#B45309' },
      
      // Código
      'txt': { icon: faFileCode, color: '#1F2937' },
      'json': { icon: faFileCode, color: '#1F2937' },
      'xml': { icon: faFileCode, color: '#1F2937' }
    };

    return iconMap[extension] || { icon: faFileAlt, color: '#4B5563' }; // Ícono por defecto
  };

  // Validación inicial
  if (!anestesia) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          No se encontraron datos de anestesia
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const getTipoRetornoColor = (tipo) => {
    const tipos = {
      'Normal': 'success',
      'Prolongado': 'warning',
      'Deceso': 'danger'
    };
    return tipos[tipo] || 'secondary';
  };

  const getEvaluacionColor = (evaluacion) => {
    const evaluaciones = {
      'Excelente': 'success',
      'Buena': 'info',
      'Regular': 'warning',
      'Mala': 'danger',
      'Pésima': 'dark'
    };
    return evaluaciones[evaluacion] || 'secondary';
  };

  if (loading || !anestesia) return null;

  const renderInfoSection = (label, value, icon) => (
    <div className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <FontAwesomeIcon icon={icon} size="1x" style={{ color: '#70AA68' }} />
      <div>
        <div style={{ fontSize: '0.85rem', color: '#718096' }}>{label}</div>
        <div style={{ fontWeight: '500' }}>{value}</div>
      </div>
    </div>
  );

  const renderDimensionCard = (label, value, icon) => (
    <div style={cardStyle}>
      <h6 style={labelStyle}>{label}</h6>
      <p style={valueStyle}>{value}</p>
    </div>
  );

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton style={{ 
        borderBottom: '2px solid #70AA68',
        background: 'linear-gradient(to right, #70AA68, #90c58e)'
      }}>
        <Modal.Title style={{ color: '#fff' }}>
          Detalles de Anestesia
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: '#f8f9fa', padding: '25px' }}>
        {/* Información General */}
        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faClipboardList} />
            Información General
          </h4>
          <Row className="g-4">
            <Col md={6}>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-success me-2" />
                  <span className="text-muted">Fecha</span>
                </div>
                <div className="fw-bold">{new Date(anestesia?.fecha).toLocaleDateString()}</div>
              </div>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-success me-2" />
                  <span className="text-muted">Lugar</span>
                </div>
                <div className="fw-bold">{anestesia?.lugarAnestesia}</div>
              </div>
            </Col>
            <Col md={6}>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faThermometer} className="text-success me-2" />
                  <span className="text-muted">Temperatura Ambiente</span>
                </div>
                <div className="fw-bold">{anestesia?.temperaturaAmbiente}°C</div>
              </div>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-success me-2" />
                  <span className="text-muted">Responsable</span>
                </div>
                <div className="fw-bold">{anestesia?.responsable}</div>
              </div>
            </Col>
          </Row>
        </section>

        {/* Protocolo Anestésico */}
        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faNotesMedical} />
            Protocolo Anestésico
          </h4>
          
          {/* Primera fila - información principal */}
          <Row className="g-3 mb-3">
            <Col md={6}>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faClipboardQuestion} className="text-success me-2" size="sm" />
                  <div>
                    <div className="text-muted small">Motivo</div>
                    <div style={{ fontSize: '0.95rem' }}>{anestesia?.protocoloAnestesico?.motivoAnestesia}</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faHandHoldingMedical} className="text-success me-2" size="sm" />
                  <div>
                    <div className="text-muted small">Método de Contención</div>
                    <div style={{ fontSize: '0.95rem' }}>{anestesia?.protocoloAnestesico?.metodoContencion}</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faClock} className="text-success me-2" size="sm" />
                  <div>
                    <div className="text-muted small">Ayuno - Comida</div>
                    <div style={{ fontSize: '0.95rem' }}>{anestesia?.protocoloAnestesico?.tiempoAyuno?.comida} horas</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faDroplet} className="text-success me-2" size="sm" />
                  <div>
                    <div className="text-muted small">Ayuno - Agua</div>
                    <div style={{ fontSize: '0.95rem' }}>{anestesia?.protocoloAnestesico?.tiempoAyuno?.agua} horas</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center">
                  <Bed size={16} className="text-success me-2" />
                  <div>
                    <div className="text-muted small">Decúbito</div>
                    <div style={{ fontSize: '0.95rem' }}>{anestesia?.protocoloAnestesico?.decubito}</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div style={infoCardStyle}>
                <div className="d-flex align-items-center">
                  <Ruler size={16} className="text-success me-2" />
                  <div>
                    <div className="text-muted small">Diámetro Tubo Endotraqueal</div>
                    <div style={{ fontSize: '0.95rem' }}>{anestesia?.protocoloAnestesico?.diametroTuboEndotraqueal} mm</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Segunda fila - tiempos */}
          <Row className="g-4 mb-4">
            <Col md={3}>
              <div style={{
                ...infoCardStyle,
                background: 'linear-gradient(135deg, #86efac 0%, #bbf7d0 100%)',
                color: '#166534',
                textAlign: 'center',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(134, 239, 172, 0.15)',
                transition: 'transform 0.3s ease',
                cursor: 'default',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Clock size={24} className="mb-2" style={{ color: '#166534' }} />
                <div style={{ color: '#166534', opacity: 0.8 }} className="mb-1">Inicio Anestesia</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                  {anestesia?.protocoloAnestesico?.inicioAnestesia}
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div style={{
                ...infoCardStyle,
                background: 'linear-gradient(135deg, #86efac 0%, #bbf7d0 100%)',
                color: '#166534',
                textAlign: 'center',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(134, 239, 172, 0.15)',
                transition: 'transform 0.3s ease',
                cursor: 'default',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Clock size={24} className="mb-2" style={{ color: '#166534' }} />
                <div style={{ color: '#166534', opacity: 0.8 }} className="mb-1">Inicio Intervención</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                  {anestesia?.protocoloAnestesico?.inicioIntervencion}
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div style={{
                ...infoCardStyle,
                background: 'linear-gradient(135deg, #fca5a5 0%, #fecaca 100%)',
                color: '#991b1b',
                textAlign: 'center',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(252, 165, 165, 0.15)',
                transition: 'transform 0.3s ease',
                cursor: 'default',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Clock size={24} className="mb-2" style={{ color: '#991b1b' }} />
                <div style={{ color: '#991b1b', opacity: 0.8 }} className="mb-1">Fin Intervención</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                  {anestesia?.protocoloAnestesico?.finIntervencion}
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div style={{
                ...infoCardStyle,
                background: 'linear-gradient(135deg, #fca5a5 0%, #fecaca 100%)',
                color: '#991b1b',
                textAlign: 'center',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(252, 165, 165, 0.15)',
                transition: 'transform 0.3s ease',
                cursor: 'default',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Clock size={24} className="mb-2" style={{ color: '#991b1b' }} />
                <div style={{ color: '#991b1b', opacity: 0.8 }} className="mb-1">Fin Anestesia</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                  {anestesia?.protocoloAnestesico?.finAnestesia}
                </div>
              </div>
            </Col>
          </Row>

          {/* Tercera fila - Duración Anestesia */}
          <Row className="mt-4">
            <Col md={12}>
              <div style={{
                ...infoCardStyle,
                background: 'linear-gradient(135deg, #93c5fd 0%, #bfdbfe 100%)',
                color: '#1e40af',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(147, 197, 253, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px'
              }}>
                <Timer size={24} style={{ color: '#1e40af' }} />
                <div>
                  <div style={{ color: '#1e40af', opacity: 0.8 }}>Duración Total Anestesia</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '600' }}>
                    {anestesia?.protocoloAnestesico?.duracionAnestesia} minutos
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* Drogas Administradas */}
        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faSyringe} />
            Drogas Administradas
          </h4>
          <div className="table-responsive">
            <Table className="custom-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Fármaco y concentración (mg/ml)</th>
                  <th>Dosis (mg/kg)</th>
                  <th>Volumen (ml)</th>
                  <th>Tipo</th>
                  <th>Vía</th>
                  <th>Éxito</th>
                  <th>Efecto</th>
                </tr>
              </thead>
              <tbody>
                {anestesia.protocoloAnestesico?.drogas?.map((droga, index) => (
                  <tr key={index}>
                    <td>{droga.hora}</td>
                    <td>{droga.farmaco} {droga.concentracion}</td>
                    <td>{droga.dosis}</td>
                    <td>{droga.volumen}</td>
                    <td><Badge bg="info">{getTipoDroga(droga.tipo)}</Badge></td>
                    <td><Badge bg="secondary">{getMedioVia(droga.medioVia)}</Badge></td>
                    <td><Badge bg="success">{getExitoAplicacion(droga.exitoAplicacion)}</Badge></td>
                    <td>
                      <Badge bg={getEfectoColor(droga.efecto).color}>
                        {getEfectoColor(droga.efecto).label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>

        {/* Monitoreo */}
        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faHeartbeat} />
            Monitoreo de Signos Vitales
          </h4>
          <div className="vital-signs-grid">
            {anestesia.monitoreo?.map((item, index) => (
              <div key={index} className="vital-sign-card" style={{
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div className="time-stamp" style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#2C5282',
                  marginBottom: '15px',
                  borderBottom: '2px solid #E2E8F0',
                  paddingBottom: '8px'
                }}>{item.hora}</div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div className="vital-sign">
                    <Heart size={16} className="text-danger" />
                    <span style={{ marginLeft: '8px' }}>FC: {item.frecuenciaCardiaca}</span>
                  </div>
                  <div className="vital-sign">
                    <Activity size={16} className="text-warning" />
                    <span style={{ marginLeft: '8px' }}>Pulso: {item.pulso}</span>
                  </div>
                  <div className="vital-sign">
                    <Wind size={16} className="text-info" />
                    <span style={{ marginLeft: '8px' }}>FR: {item.frecuenciaRespiratoria}</span>
                  </div>
                  <div className="vital-sign">
                    <Activity size={16} className="text-warning" />
                    <span style={{ marginLeft: '8px' }}>PA: {item.presionArterial?.PAS}/{item.presionArterial?.PAD} 
                      (PAM: {item.presionArterial?.PAM})</span>
                  </div>
                  <div className="vital-sign">
                    <Thermometer size={16} className="text-danger" />
                    <span style={{ marginLeft: '8px' }}>T°: {item.temperatura}°C</span>
                  </div>
                  <div className="vital-sign">
                    <Clock size={16} className="text-primary" />
                    <span style={{ marginLeft: '8px' }}>TLC: {item.tiempoLlenadoCapilar}</span>
                  </div>
                  <div className="vital-sign">
                    <Droplet size={16} className="text-info" />
                    <span style={{ marginLeft: '8px' }}>Hidratación: {item.estadoHidratacion}</span>
                  </div>
                  <div className="vital-sign">
                    <Zap size={16} className="text-warning" />
                    <span style={{ marginLeft: '8px' }}>Reflejos: {item.reflejos}</span>
                  </div>
                  <div className="vital-sign" style={{ display: 'flex', alignItems: 'center' }}>
                    <Stethoscope size={16} className="text-info" />
                    <span style={{ marginLeft: '8px' }}>SpO2:</span>
                    <ProgressBar 
                      now={item.saturacionOxigeno} 
                      label={`${item.saturacionOxigeno}%`}
                      variant="success"
                      style={{ 
                        width: '100px',
                        height: '15px',
                        backgroundColor: '#e9ecef',
                        fontSize: '0.8rem',
                        marginLeft: '8px'
                      }}
                    />
                  </div>
                </div>

                {item.comentarios && (
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#F7FAFC',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}>
                    <MessageSquare size={16} className="text-muted me-2" />
                    <span>{item.comentarios}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recuperación */}
        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faCheckCircle} />
            Recuperación
          </h4>
          
          {/* Primera fila - Tiempos */}
          <Row className="g-4 mb-4">
            <Col md={4}>
              <div style={{
                ...infoCardStyle,
                backgroundColor: '#f8fafc',
                height: '100%'
              }}>
                <div className="d-flex align-items-center mb-2">
                  <Brain size={16} className="text-primary me-2" />
                  <span className="text-muted">Control de Cabeza</span>
                </div>
                <div className="fw-bold" style={{ fontSize: '1.1rem' }}>
                  {anestesia.recuperacionAnestesia?.controlCabeza || 'No especificado'}
                </div>
              </div>
            </Col>
            
            <Col md={4}>
              <div style={{
                ...infoCardStyle,
                backgroundColor: '#f8fafc',
                height: '100%'
              }}>
                <div className="d-flex align-items-center mb-2">
                  <PersonStanding size={16} className="text-success me-2" />
                  <span className="text-muted">Estación</span>
                </div>
                <div className="fw-bold" style={{ fontSize: '1.1rem' }}>
                  {anestesia.recuperacionAnestesia?.estacion || 'No especificado'}
                </div>
              </div>
            </Col>
            
            <Col md={4}>
              <div style={{
                ...infoCardStyle,
                backgroundColor: '#f8fafc',
                height: '100%'
              }}>
                <div className="d-flex align-items-center mb-2">
                  <CheckCircle2 size={16} className="text-success me-2" />
                  <span className="text-muted">Recuperación Completa</span>
                </div>
                <div className="fw-bold" style={{ fontSize: '1.1rem' }}>
                  {anestesia.recuperacionAnestesia?.recuperacionCompleta || 'No especificado'}
                </div>
              </div>
            </Col>
          </Row>

          {/* Segunda fila - Tipo de Retorno y Complicaciones */}
          <Row className="g-4">
            <Col md={6}>
              <div style={{
                ...infoCardStyle,
                backgroundColor: '#f8fafc',
                height: '100%'
              }}>
                <div className="d-flex align-items-center mb-3">
                  <RotateCcw size={16} className="text-primary me-2" />
                  <span className="text-muted">Tipo de Retorno</span>
                </div>
                <Badge 
                  bg="primary"
                  style={{ 
                    fontSize: '0.9rem', 
                    padding: '8px 12px',
                    backgroundColor: '#3b82f6'
                  }}
                >
                  {anestesia.retorno?.tipo || 'No especificado'}
                </Badge>
              </div>
            </Col>
            
            <Col md={6}>
              <div style={{
                ...infoCardStyle,
                backgroundColor: '#f8fafc',
                height: '100%'
              }}>
                <div className="d-flex align-items-center mb-3">
                  <AlertTriangle size={16} className="text-danger me-2" />
                  <span className="text-muted">Complicaciones</span>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {anestesia.retorno?.complicaciones?.map((comp, index) => (
                    <Badge 
                      key={index} 
                      bg="danger"
                      style={{ 
                        fontSize: '0.9rem', 
                        padding: '8px 12px',
                        backgroundColor: '#ef4444',
                        opacity: 0.9
                      }}
                    >
                      {comp}
                    </Badge>
                  )) || 'Ninguna'}
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* Fluidoterapia */}
        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faDroplet} />
            Fluidoterapia
          </h4>
          <div className="table-responsive">
            <Table className="custom-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Fármaco y concentración (mg/ml)</th>
                  <th>Dosis (ml/kg/h)</th>
                  <th>Vía</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {anestesia.tratamientoFluidoterapia?.map((fluido, index) => (
                  <tr key={index}>
                    <td>{fluido.hora}</td>
                    <td>{fluido.farmaco}</td>
                    <td>{fluido.dosis}</td>
                    <td><Badge bg="info">{fluido.via}</Badge></td>
                    <td>{fluido.comentarios}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>

        {/* Archivos Adjuntos */}
        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faFile} />
            Archivos Adjuntos
          </h4>
          
          {anestesia?.adjuntos?.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
              padding: '20px'
            }}>
              {anestesia.adjuntos.map((url, index) => {
                const { icon, color } = getFileIcon(url);
                const fileName = url.split('/').pop(); // Obtiene el nombre del archivo de la URL

                return (
                  <a 
                    key={index}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '20px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                      textDecoration: 'none',
                      color: '#4A5568',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      e.currentTarget.style.backgroundColor = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      color: '#fff'
                    }}>
                      <FontAwesomeIcon icon={icon} size="2x" />
                    </div>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      textAlign: 'center',
                      marginBottom: '5px',
                      wordBreak: 'break-word',
                      maxWidth: '100%'
                    }}>
                      {fileName}
                    </span>
                    <span style={{
                      fontSize: '0.8rem',
                      color: '#718096',
                      textAlign: 'center'
                    }}>
                      Click para abrir
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#666',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              margin: '20px 0'
            }}>
              <FontAwesomeIcon 
                icon={faFile} 
                style={{ 
                  fontSize: '3rem', 
                  marginBottom: '15px', 
                  opacity: 0.5 
                }} 
              />
              <p style={{ margin: 0 }}>No hay archivos adjuntos disponibles</p>
            </div>
          )}
        </section>
      </Modal.Body>

      <Modal.Footer style={{ 
        borderTop: '2px solid #70AA68',
        padding: '15px 25px'
      }}>
        <Button 
          variant="secondary" 
          onClick={handleClose}
          style={{
            backgroundColor: '#70AA68',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 25px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5C8F55';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#70AA68';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewAnestesiaModal;