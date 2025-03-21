import React, { useState, useEffect } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { Calendar, FileText, Activity, Pill, User, MessageSquare } from 'lucide-react';
import axios from 'axios';
import './ViewTratamientoModal.css';

const ViewTratamientoModal = ({ show, handleClose, tratamientoId }) => {
  const [tratamiento, setTratamiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && tratamientoId) {
      fetchTratamiento();
    }
  }, [show, tratamientoId]);

  const fetchTratamiento = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}tratamiento/${tratamientoId}`);
      setTratamiento(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener el tratamiento:', error);
      setError('Error al cargar el tratamiento');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" className="tratamiento-modal">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Modal>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!tratamiento) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="tratamiento-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <Activity size={24} className="me-2" />
          Detalles del Tratamiento
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="dashboard-grid">
          {/* Información General */}
          <Card className="info-card">
            <Card.Body>
              <h5 className="card-title">
                <Calendar size={20} className="me-2" />
                Información General
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <Calendar className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Fecha</span>
                    <span className="info-value">
                      {new Date(tratamiento.fecha).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <Activity className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Tipo de Tratamiento</span>
                    <span className="info-value">{tratamiento.tipoTratamiento}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Información del Fármaco */}
          {tratamiento.tipoTratamiento === 'Farmacológico' && (
            <Card className="info-card">
              <Card.Body>
                <h5 className="card-title">
                  <Pill size={20} className="me-2" />
                  Información del Fármaco
                </h5>
                <div className="info-content">
                  <div className="info-item">
                    <FileText className="info-icon" size={20} />
                    <div className="info-text">
                      <span className="info-label">Nombre Comercial</span>
                      <span className="info-value">{tratamiento.farmaco.nombreComercial}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FileText className="info-icon" size={20} />
                    <div className="info-text">
                      <span className="info-label">Nombre de la Droga</span>
                      <span className="info-value">{tratamiento.farmaco.nombreDroga}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FileText className="info-icon" size={20} />
                    <div className="info-text">
                      <span className="info-label">Concentración</span>
                      <span className="info-value">{tratamiento.farmaco.concentration}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Información de la Dosis */}
          <Card className="info-card">
            <Card.Body>
              <h5 className="card-title">
                <Pill size={20} className="me-2" />
                Información de la Dosis
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <FileText className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Dosis por Especie</span>
                    <span className="info-value">{tratamiento.dosis.dosisEspecie}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FileText className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Dosis Práctica</span>
                    <span className="info-value">{tratamiento.dosis.dosisPractica}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FileText className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Vía de Administración</span>
                    <span className="info-value">{tratamiento.dosis.viaAdministracion}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FileText className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Frecuencia</span>
                    <span className="info-value">{tratamiento.dosis.frecuencia}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FileText className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Tiempo de Tratamiento</span>
                    <span className="info-value">{tratamiento.dosis.tiempoTratamiento}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FileText className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Éxito de Administración</span>
                    <span className="info-value">{tratamiento.dosis.exitoAdministracion}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Detalle del Tratamiento No Farmacológico */}
          {tratamiento.tipoTratamiento === 'No farmacológico' && (
            <Card className="info-card">
              <Card.Body>
                <h5 className="card-title">
                  <MessageSquare className="info-icon" size={20} />
                  Detalle del Tratamiento No Farmacológico
                </h5>
                <div className="info-content">
                  <div className="info-item">
                    <MessageSquare className="info-icon" size={20} />
                    <div className="info-text">
                      <span className="info-label">Detalle</span>
                      <span className="info-value">{tratamiento.detalleNoFarmacologico}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Responsable */}
          <Card className="info-card">
            <Card.Body>
              <h5 className="card-title">
                <User className="info-icon" size={20} />
                Responsable
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <User className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Nombre</span>
                    <span className="info-value">{tratamiento.responsable}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Observaciones */}
          <Card className="info-card">
            <Card.Body>
              <h5 className="card-title">
                <MessageSquare className="info-icon" size={20} />
                Observaciones
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <MessageSquare className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Observaciones</span>
                    <span className="info-value">{tratamiento.observaciones}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Archivos Adjuntos */}
          {tratamiento.adjuntos && tratamiento.adjuntos.length > 0 && (
            <Card className="info-card">
              <Card.Body>
                <h5 className="card-title">
                  <MessageSquare className="info-icon" size={20} />
                  Archivos Adjuntos
                </h5>
                <div className="attachments-grid">
                  {tratamiento.adjuntos.map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="attachment-link">
                      Ver archivo {index + 1}
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

export default ViewTratamientoModal;
