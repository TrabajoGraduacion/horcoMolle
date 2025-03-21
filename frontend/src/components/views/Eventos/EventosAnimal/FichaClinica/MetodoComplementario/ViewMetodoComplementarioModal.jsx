import React, { useState, useEffect } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { Calendar, FileText, MessageSquare, Building2, User, Microscope, TestTube, MapPin, DollarSign } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ViewMetodoComplementarioModal.css';

const ViewMetodoComplementarioModal = ({ show, handleClose, metodoId }) => {
  const [metodo, setMetodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && metodoId) {
      fetchMetodo();
    }
  }, [show, metodoId]);

  const fetchMetodo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}examen-complementario/${metodoId}`);
      setMetodo(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener el método complementario:', error);
      setError('Error al cargar el método complementario');
      Swal.fire('Error', 'No se pudo cargar la información del método complementario', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" className="metodo-complementario-modal">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Modal>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!metodo) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="metodo-complementario-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <Microscope size={24} className="me-2" />
          Método Complementario
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <div className="dashboard-grid">
          {/* Información del Examen */}
          <Card className="info-card">
            <Card.Body>
              <h5 className="card-title">
                <TestTube size={20} className="me-2" />
                Información del Examen
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <FileText className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Tipo de Examen</span>
                    <span className="info-value">{metodo.tipoExamen}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Microscope className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Método</span>
                    <span className="info-value">{metodo.metodo}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Información de la Muestra */}
          <Card className="sample-card">
            <Card.Body>
              <h5 className="card-title">
                <TestTube size={20} className="me-2" />
                Información de la Muestra
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <FileText className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Toma de Muestra</span>
                    <span className="info-value">{metodo.tomaMuestra}</span>
                  </div>
                </div>
                <div className="info-item">
                  <User className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Realizado Por</span>
                    <span className="info-value">{metodo.realizadoPor}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Información del Lugar de Remisión */}
          <Card className="remission-card">
            <Card.Body>
              <h5 className="card-title">
                <Building2 size={20} className="me-2" />
                Lugar de Remisión
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <Building2 className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Institución</span>
                    <span className="info-value">{metodo.lugarRemision.nombreInstitucion}</span>
                  </div>
                </div>
                <div className="info-item">
                  <MapPin className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Dirección</span>
                    <span className="info-value">{metodo.lugarRemision.direccion}</span>
                  </div>
                </div>
                <div className="info-item">
                  <User className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Contacto</span>
                    <span className="info-value">{metodo.lugarRemision.contacto}</span>
                  </div>
                </div>
                <div className="info-item">
                  <DollarSign className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Costo</span>
                    <span className="info-value">${metodo.lugarRemision.costo}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Resultados y Observaciones */}
          <Card className="results-card">
            <Card.Body>
              <h5 className="card-title">
                <FileText size={20} className="me-2" />
                Resultados y Observaciones
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Resultados</span>
                    <span className="info-value">{metodo.resultados}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Observaciones</span>
                    <span className="info-value">{metodo.observaciones}</span>
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

export default ViewMetodoComplementarioModal;
