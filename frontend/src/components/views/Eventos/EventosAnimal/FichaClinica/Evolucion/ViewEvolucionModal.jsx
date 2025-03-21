import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Badge } from 'react-bootstrap';
import { Calendar, Activity, FileText, User, MessageSquare, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ViewEvolucionModal.css';

const ViewEvolucionModal = ({ show, handleClose, evolucionId }) => {
  const [evolucion, setEvolucion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && evolucionId) {
      fetchEvolucion();
    }
  }, [show, evolucionId]);

  const fetchEvolucion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}evolucion/${evolucionId}`);
      setEvolucion(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener la evolución:', error);
      setError('Error al cargar la evolución');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const estados = {
      'Excelente': 'success',
      'Bueno': 'info',
      'Regular': 'warning',
      'Malo': 'danger',
      'Crítico': 'dark'
    };
    return estados[estado] || 'secondary';
  };

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" className="evolucion-modal">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Modal>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!evolucion) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="evolucion-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <Activity size={24} className="me-2" />
          Registro de Evolución
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
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
                      {new Date(evolucion.fecha).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <Activity className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Estado General</span>
                    <span className="info-value">
                      <Badge bg={getEstadoColor(evolucion.estadoGeneral)}>
                        {evolucion.estadoGeneral}
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Cambios en la Condición */}
          <Card className="condition-card">
            <Card.Body>
              <h5 className="card-title">
                <MessageSquare size={20} className="me-2" />
                Cambios en la Condición
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-value">{evolucion.cambiosCondicion}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Información de Registro */}
          <Card className="registry-card">
            <Card.Body>
              <h5 className="card-title">
                <User size={20} className="me-2" />
                Información de Registro
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <Calendar className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Fecha de Creación</span>
                    <span className="info-value">
                      {new Date(evolucion.creadoEn).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
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

export default ViewEvolucionModal;
