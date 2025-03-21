import React, { useState, useEffect } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { Calendar, FileText, Activity, Skull } from 'lucide-react';
import axios from 'axios';
import './ViewNecropsiaModal.css';

const ViewNecropsiaModal = ({ show, handleClose, necropsiaId }) => {
  const [necropsia, setNecropsia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && necropsiaId) {
      fetchNecropsia();
    }
  }, [show, necropsiaId]);

  const fetchNecropsia = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}necropsia/${necropsiaId}`);
      setNecropsia(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener la necropsia:', error);
      setError('Error al cargar la necropsia');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!necropsia) return null;

  return (
    <Modal show={show} onHide={handleClose} size="xl" className="necropsia-modal">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <Skull size={24} className="me-2" />
          Detalles de la Necropsia
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <div className="dashboard-grid">
          <Card>
            <Card.Body>
              <h5 className="card-title">
                <Calendar size={20} className="me-2" />
                Información Temporal
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Fecha de Muerte</span>
                    <span className="info-value">
                      {new Date(necropsia.fechaMuerte).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Fecha de Necropsia</span>
                    <span className="info-value">
                      {new Date(necropsia.fechaNecropsia).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5 className="card-title">
                <Activity size={20} className="me-2" />
                Detalles del Procedimiento
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Conservación de la Carcasa</span>
                    <span className="info-value">{necropsia.conservacionCarcasa}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Condición de Muerte</span>
                    <span className="info-value">{necropsia.condicionMuerte}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Local de Necropsia</span>
                    <span className="info-value">{necropsia.localNecropsia}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Persona que Realiza</span>
                    <span className="info-value">{necropsia.personaRealiza}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5 className="card-title">
                <FileText size={20} className="me-2" />
                Información Clínica
              </h5>
              <div className="info-content">
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Historia Clínica</span>
                    <span className="info-value">{necropsia.historiaClinica}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-text">
                    <span className="info-label">Sospecha Clínica</span>
                    <span className="info-value">{necropsia.sospechaClinica}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {necropsia.adjuntosUrls?.length > 0 && (
            <Card>
              <Card.Body>
                <h5 className="card-title">
                  <FileText size={20} className="me-2" />
                  Archivos Adjuntos
                </h5>
                <div className="attachments-grid">
                  {necropsia.adjuntosUrls.map((url, index) => (
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

export default ViewNecropsiaModal;
