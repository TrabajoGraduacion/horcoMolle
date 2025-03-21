import React, { useState, useEffect } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { Calendar, Activity, FileText, MessageSquare, Stethoscope, ClipboardList } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ViewDiagnosticoModal.css';

const ViewDiagnosticoModal = ({ show, handleClose, diagnosticoId }) => {
  const [diagnostico, setDiagnostico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && diagnosticoId) {
      fetchDiagnostico();
    }
  }, [show, diagnosticoId]);

  const fetchDiagnostico = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}diagnostico/${diagnosticoId}`);
      setDiagnostico(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener el diagnóstico:', error);
      setError('Error al cargar el diagnóstico');
      Swal.fire('Error', 'No se pudo cargar la información del diagnóstico', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} size="lg" className="diagnostico-modal">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Modal>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!diagnostico) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="diagnostico-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <Stethoscope size={24} className="me-2" />
          Registro de Diagnóstico
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
                      {new Date(diagnostico.fecha).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <Activity className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Tipo de Diagnóstico</span>
                    <span className="info-value">{diagnostico.tipoDiagnostico}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Diagnóstico Principal */}
          <Card className="diagnosis-card">
            <Card.Body>
              <h5 className="card-title">
                <Stethoscope size={20} className="me-2" />
                Diagnóstico Principal
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-value">{diagnostico.diagnosticoPrincipal}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Diagnósticos Secundarios */}
          <Card className="secondary-diagnosis-card">
            <Card.Body>
              <h5 className="card-title">
                <ClipboardList size={20} className="me-2" />
                Diagnósticos Secundarios
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-value">{diagnostico.diagnosticosSecundarios}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Recomendaciones */}
          <Card className="recommendations-card">
            <Card.Body>
              <h5 className="card-title">
                <MessageSquare size={20} className="me-2" />
                Recomendaciones
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-value">{diagnostico.recomendaciones}</span>
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

export default ViewDiagnosticoModal;
