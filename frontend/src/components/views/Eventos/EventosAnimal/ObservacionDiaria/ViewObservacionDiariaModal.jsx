import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faEye, faFileImage } from '@fortawesome/free-solid-svg-icons';

const ViewObservacionDiariaModal = ({ show, handleClose, observacion }) => {
  if (!observacion) return null;

  const handleViewFile = (url) => {
    window.open(url, '_blank');
  };

  const renderFileButtons = (archivos) => {
    if (!archivos || !Array.isArray(archivos)) return null;

    return archivos
      .filter(url => url !== null)
      .map((url, index) => (
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
      ));
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ver Observación Diaria</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item><strong>Fecha de Observación:</strong> {new Date(observacion.fechaObservacion).toLocaleDateString()}</ListGroup.Item>
          <ListGroup.Item><strong>Hora:</strong> {observacion.hora}</ListGroup.Item>
          <ListGroup.Item><strong>Duración:</strong> {observacion.duracion}</ListGroup.Item>
          <ListGroup.Item><strong>Contexto Ambiental:</strong> {observacion.contextoAmbiental}</ListGroup.Item>

          <ListGroup.Item>
            <h5>Enfoque Comportamental</h5>
            <p><strong>Actividad:</strong> {observacion.enfoqueComportamental.actividad}</p>
            <p><strong>Social:</strong> {observacion.enfoqueComportamental.social}</p>
            <p><strong>Comportamental:</strong> {observacion.enfoqueComportamental.comportamental}</p>
            <p><strong>Nutrición:</strong> {observacion.enfoqueComportamental.nutricion}</p>
            <p><strong>Manejo:</strong> {observacion.enfoqueComportamental.manejo}</p>
            
            <div className="mt-2">
              <strong>Archivos del Enfoque Comportamental:</strong>
              {observacion.archivosEnfoqueComportamental?.length > 0 ? (
                <div className="mt-2">
                  {renderFileButtons(observacion.archivosEnfoqueComportamental)}
                </div>
              ) : (
                <p className="text-muted mb-0">No hay archivos disponibles</p>
              )}
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <h5>Enfoque Salud</h5>
            <p><strong>Condición Física:</strong> {observacion.enfoqueSalud.condicionFisica}</p>
            <p><strong>Discapacidad:</strong> {observacion.enfoqueSalud.discapacidad}</p>
            <p><strong>Condición General:</strong> {observacion.enfoqueSalud.condicionGeneral}</p>

            <div className="mt-2">
              <strong>Archivos del Enfoque Salud:</strong>
              {observacion.archivosEnfoqueSalud?.length > 0 ? (
                <div className="mt-2">
                  {renderFileButtons(observacion.archivosEnfoqueSalud)}
                </div>
              ) : (
                <p className="text-muted mb-0">No hay archivos disponibles</p>
              )}
            </div>
          </ListGroup.Item>

          <ListGroup.Item>
            <h5>Enfoque Ambiental</h5>
            <h6>Ambiente Externo</h6>
            <p><strong>Tiempo de Permanencia:</strong> {observacion.enfoqueAmbiental.ambienteExterno.tiempoPermanencia}</p>
            <p><strong>Higiene:</strong> {observacion.enfoqueAmbiental.ambienteExterno.higiene}</p>
            <p><strong>Seguridad:</strong> {observacion.enfoqueAmbiental.ambienteExterno.seguridad}</p>

            <h6>Ambiente Interno</h6>
            <p><strong>Tiempo de Permanencia:</strong> {observacion.enfoqueAmbiental.ambienteInterno.tiempoPermanencia}</p>
            <p><strong>Higiene:</strong> {observacion.enfoqueAmbiental.ambienteInterno.higiene}</p>
            <p><strong>Seguridad:</strong> {observacion.enfoqueAmbiental.ambienteInterno.seguridad}</p>
            <p><strong>Bioseguridad Manejador:</strong> {observacion.enfoqueAmbiental.ambienteInterno.bioseguridadManejador}</p>
            <p><strong>Bioseguridad Animal:</strong> {observacion.enfoqueAmbiental.ambienteInterno.bioseguridadAnimal}</p>

            <div className="mt-2">
              <strong>Archivos del Enfoque Ambiental:</strong>
              {observacion.archivosEnfoqueAmbiental?.length > 0 ? (
                <div className="mt-2">
                  {renderFileButtons(observacion.archivosEnfoqueAmbiental)}
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

export default ViewObservacionDiariaModal;