import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Row, Col, Collapse } from 'react-bootstrap';
import { Calendar, FileText, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './ViewOdontogramaModal.css';

const capitalizarTexto = (texto) => {
  return texto
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(' ');
};

const tieneProblemas = (diente) => {
  if (!diente) return false;
  return Object.entries(diente).some(([key, value]) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0;
    if (typeof value === 'string') return value !== '';
    return false;
  });
};

const DienteCollapsible = ({ numero, diente }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`diente-card ${tieneProblemas(diente) ? 'tiene-problemas' : ''}`}>
      <div className="diente-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="numero">#{numero}</span>
        <span className="indicador">
          {tieneProblemas(diente) ? '⚠️' : '✓'}
        </span>
      </div>
      <Collapse in={isOpen}>
        <div className="diente-content">
          {Object.entries(diente).map(([campo, valor]) => {
            if (valor === false || valor === '') return null;
            if (typeof valor === 'boolean' && valor) {
              return (
                <div key={campo} className="mb-2">
                  <strong>{capitalizarTexto(campo)}:</strong> Sí
                </div>
              );
            }
            return (
              <div key={campo} className="mb-2">
                <strong>{capitalizarTexto(campo)}:</strong> {valor}
              </div>
            );
          })}
        </div>
      </Collapse>
    </div>
  );
};

const SeccionDientes = ({ titulo, dientes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tieneAlgunDato = Object.keys(dientes).length > 0;

  return (
    <div className="seccion-dientes">
      <div 
        className={`seccion-header ${tieneAlgunDato ? 'tiene-datos' : 'sin-datos'}`}
        onClick={() => tieneAlgunDato && setIsOpen(!isOpen)}
      >
        <span className="seccion-titulo">{capitalizarTexto(titulo)}</span>
        {tieneAlgunDato ? (
          <span className="seccion-indicador">{isOpen ? '▼' : '▶'}</span>
        ) : (
          <span className="seccion-sin-datos">(No se cargaron datos)</span>
        )}
      </div>
      <Collapse in={isOpen}>
        <div className="dientes-lista">
          {Object.entries(dientes).map(([numero, diente]) => (
            <DienteCollapsible
              key={numero}
              numero={numero}
              diente={diente}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

const ViewOdontogramaModal = ({ show, handleClose, odontogramaId }) => {
  const [odontograma, setOdontograma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState('superiorDerecho');

  useEffect(() => {
    if (show && odontogramaId) {
      fetchOdontograma();
    }
  }, [show, odontogramaId]);

  const fetchOdontograma = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}odontograma/${odontogramaId}`);
      setOdontograma(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener el odontograma:', error);
      setError('Error al cargar el odontograma');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!odontograma) return null;

  const tipoAnimalActivo = Object.keys(odontograma).find(key => 
    ['canidos', 'felinos', 'primates', 'tapires', 'cervido', 'coipos', 'pecaris'].includes(key) && 
    odontograma[key]
  );

  const seccionesData = odontograma[tipoAnimalActivo]?.[seccionActiva] || {};

  return (
    <Modal show={show} onHide={handleClose} size="xl" className="odontograma-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <Activity size={24} className="me-2" />
          Detalles del Odontograma
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <div className="dashboard-grid">
          {/* Información General */}
          <Card>
            <Card.Body>
              <h5 className="card-title">
                <Calendar size={20} className="me-2" />
                Información General
              </h5>
              <div className="info-content">
                <div className="info-item mb-2">
                  <Calendar size={20} className="info-icon text-primary" />
                  <div className="info-text">
                    <span className="info-label">Fecha</span>
                    <span className="info-value">
                      {new Date(odontograma.fecha).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="info-item mb-2">
                  <Calendar size={20} className="info-icon text-primary" />
                  <div className="info-text">
                    <span className="info-label">Próxima Revisión</span>
                    <span className="info-value">
                      {odontograma.proximaRevision ? 
                        new Date(odontograma.proximaRevision).toLocaleDateString() : 
                        'No especificada'}
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Examen General */}
          <Card>
            <Card.Body>
              <h5 className="card-title">
                <AlertTriangle size={20} className="me-2" />
                Examen General
              </h5>
              {Object.entries(odontograma.examenGeneral).map(([campo, valor]) => (
                <div key={campo} className="info-item mb-2">
                  <div className="info-text">
                    <span className="info-label">{capitalizarTexto(campo)}</span>
                    <span className="info-value">{valor}</span>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* Odontograma */}
          <Card className="odontograma-section">
            <Card.Body>
              <h5 className="card-title">
                <Activity size={20} className="me-2" />
                Odontograma {capitalizarTexto(tipoAnimalActivo)}
              </h5>
              <div className="secciones-acordeon">
                {['superiorDerecho', 'superiorIzquierdo', 'inferiorDerecho', 'inferiorIzquierdo'].map(seccion => (
                  <SeccionDientes
                    key={seccion}
                    titulo={seccion}
                    dientes={odontograma[tipoAnimalActivo]?.[seccion] || {}}
                  />
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Observaciones */}
          <Card>
            <Card.Body>
              <h5 className="card-title">
                <FileText size={20} className="me-2" />
                Observaciones Generales
              </h5>
              <div className="info-item">
                <div className="info-text">
                  <p>{odontograma.observacionesGenerales}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Archivos Adjuntos */}
          {odontograma.archivosAdjuntos?.length > 0 && (
            <Card>
              <Card.Body>
                <h5 className="card-title">
                  <FileText size={20} className="me-2" />
                  Archivos Adjuntos
                </h5>
                <div className="attachments-grid">
                  {odontograma.archivosAdjuntos.map((url, index) => (
                    <a 
                      key={index}
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="attachment-link"
                    >
                      <FileText size={24} />
                      <span>Adjunto {index + 1}</span>
                    </a>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewOdontogramaModal;
