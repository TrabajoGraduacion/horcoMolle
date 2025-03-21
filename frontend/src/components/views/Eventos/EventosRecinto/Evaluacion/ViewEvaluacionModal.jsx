import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Carousel, Image } from 'react-bootstrap';
import axios from 'axios';

const ViewEvaluacionModal = ({ show, onHide, eventId }) => {
  const [evaluacion, setEvaluacion] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && eventId) {
      fetchEvaluacion();
    }
  }, [show, eventId]);

  const fetchEvaluacion = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}evaluacion-recinto/${eventId}`);
      setEvaluacion(response.data);
    } catch (error) {
      console.error('Error al obtener la evaluación:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Body>Cargando...</Modal.Body>
      </Modal>
    );
  }

  if (!evaluacion) {
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton style={{ backgroundColor: '#f0f0f0' }}>
        <Modal.Title>Ver Evaluación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label><strong>Recinto</strong></Form.Label>
            <Form.Control plaintext readOnly defaultValue={evaluacion.nombreRecinto || 'No especificado'} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><strong>Fecha de Evaluación</strong></Form.Label>
            <Form.Control plaintext readOnly defaultValue={formatDate(evaluacion.fechaEvaluacion)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><strong>Descripción</strong></Form.Label>
            <Form.Control as="textarea" rows={3} plaintext readOnly defaultValue={evaluacion.descripcion} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><strong>Condiciones Ambientales</strong></Form.Label>
            <Form.Control as="textarea" rows={3} plaintext readOnly defaultValue={evaluacion.condicionesAmbientales} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><strong>Condiciones de Bioseguridad</strong></Form.Label>
            <Form.Control as="textarea" rows={3} plaintext readOnly defaultValue={evaluacion.condicionesBioseguridad} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><strong>Calidad Didáctica</strong></Form.Label>
            <Form.Control as="textarea" rows={3} plaintext readOnly defaultValue={evaluacion.calidadDidactica} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><strong>Observaciones</strong></Form.Label>
            <Form.Control as="textarea" rows={3} plaintext readOnly defaultValue={evaluacion.observaciones} />
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label><strong>Fotografías</strong></Form.Label>
            {evaluacion.fotografias && evaluacion.fotografias.length > 0 ? (
              <Carousel>
                {evaluacion.fotografias.map((foto, index) => (
                  <Carousel.Item key={index}>
                    <div style={{
                      width: '100%',
                      height: '300px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      borderRadius: '10px',
                    }}>
                      <Image
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <p>No hay fotografías disponibles</p>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} style={{ backgroundColor: '#70AA68', borderColor: '#70AA68' }}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewEvaluacionModal;
