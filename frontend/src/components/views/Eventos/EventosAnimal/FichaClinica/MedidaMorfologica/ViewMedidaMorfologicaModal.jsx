import React, { useState, useEffect } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { Calendar, Ruler, Weight, MessageSquare, Maximize2, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ViewMedidaMorfologicaModal.css';

const ViewMedidaMorfologicaModal = ({ show, handleClose, medidaId }) => {
  const [medida, setMedida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && medidaId) {
      fetchMedida();
    }
  }, [show, medidaId]);

  const fetchMedida = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}medidas-morfologicas/${medidaId}`);
      setMedida(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener la medida morfológica:', error);
      setError('Error al cargar la medida morfológica');
      Swal.fire('Error', 'No se pudo cargar la información de la medida morfológica', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" className="medida-morfologica-modal">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Modal>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!medida) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="medida-morfologica-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <Ruler size={24} className="me-2" />
          Registro de Medidas Morfológicas
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
                      {new Date(medida.fecha).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Medidas Principales */}
          <Card className="measures-card">
            <Card.Body>
              <h5 className="card-title">
                <Ruler size={20} className="me-2" />
                Medidas Principales
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <ArrowUpDown className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Longitud Total</span>
                    <span className="info-value">{medida.longitudTotal} cm</span>
                  </div>
                </div>
                <div className="info-item">
                  <Maximize2 className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Longitud de Cabeza</span>
                    <span className="info-value">{medida.longitudCabeza} cm</span>
                  </div>
                </div>
                <div className="info-item">
                  <Ruler className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Longitud de Cola</span>
                    <span className="info-value">{medida.longitudCola} cm</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Medidas Secundarias */}
          <Card className="secondary-measures-card">
            <Card.Body>
              <h5 className="card-title">
                <Weight size={20} className="me-2" />
                Medidas Adicionales
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <Weight className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Peso</span>
                    <span className="info-value">{medida.peso} kg</span>
                  </div>
                </div>
                <div className="info-item">
                  <Maximize2 className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Circunferencia Torácica</span>
                    <span className="info-value">{medida.circunferenciaToracica} cm</span>
                  </div>
                </div>
                <div className="info-item">
                  <ArrowUpDown className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Altura a la Cruz</span>
                    <span className="info-value">{medida.alturaCruz} cm</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Observaciones */}
          <Card className="observations-card">
            <Card.Body>
              <h5 className="card-title">
                <MessageSquare size={20} className="me-2" />
                Observaciones
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-value">{medida.observaciones}</span>
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

export default ViewMedidaMorfologicaModal;
