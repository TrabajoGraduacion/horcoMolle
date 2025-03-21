import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faEye, faFileImage } from '@fortawesome/free-solid-svg-icons';

const ViewRelocalizacionModal = ({ show, handleClose, relocalizacion }) => {
  if (!relocalizacion) return null;

  console.log('Datos de relocalizacion:', relocalizacion);

  const handleViewFile = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ver Relocalización</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item>
            <strong>Animal:</strong> {relocalizacion.nombreInstitucionalAnimal || 'No especificado'}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Recinto Anterior:</strong> {relocalizacion.nombreRecintoAnterior || 'No especificado'}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Recinto Nuevo:</strong> {relocalizacion.nombreRecintoNuevo || 'No especificado'}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Fecha de Relocalización:</strong> {new Date(relocalizacion.fechaRelocalizacion).toLocaleDateString()}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Motivo:</strong> {relocalizacion.motivo}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Observaciones:</strong> {relocalizacion.observaciones}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Archivos Adjuntos:</strong>
            <div className="mt-2">
              {relocalizacion.archivos?.length > 0 ? (
                <div className="mt-2">
                  {relocalizacion.archivos.map((url, index) => (
                    <Button 
                      key={index}
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewFile(url)}
                      className="me-2 mb-2"
                    >
                      <FontAwesomeIcon 
                        icon={url.toLowerCase().endsWith('.pdf') ? faFilePdf : faFileImage} 
                        style={{ marginRight: '0.5rem' }} 
                      />
                      <FontAwesomeIcon icon={faEye} style={{ marginRight: '0.5rem' }} />
                      Ver Archivo {index + 1}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No hay archivos disponibles</p>
              )}
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewRelocalizacionModal;