import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faEye } from '@fortawesome/free-solid-svg-icons';

const ViewDietaModal = ({ show, handleClose, dieta }) => {
  if (!dieta) return null;

  const handleViewFormulacion = () => {
    window.open(dieta.formulacionDieta, '_blank');
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg"
      enforceFocus={false}
      restoreFocus={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Ver Dieta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {dieta.animalId && (
            <ListGroup.Item>
              <strong>Nombre del Animal:</strong> {dieta.nombreInstitucionalAnimal || 'No especificado'}
            </ListGroup.Item>
          )}
          <ListGroup.Item><strong>Especie:</strong> {dieta.especie}</ListGroup.Item>
          <ListGroup.Item><strong>Fecha de Inicio:</strong> {new Date(dieta.fechaInicio).toLocaleDateString()}</ListGroup.Item>
          <ListGroup.Item><strong>Estación:</strong> {dieta.estacion}</ListGroup.Item>
          <ListGroup.Item><strong>Kcal Requeridas por Especie:</strong> {dieta.kcalRequeridasSP}</ListGroup.Item>
          <ListGroup.Item><strong>Kcal de la Dieta:</strong> {dieta.kcalDieta}</ListGroup.Item>
          <ListGroup.Item><strong>Observaciones:</strong> {dieta.observaciones}</ListGroup.Item>
          <ListGroup.Item>
            <strong>Formulación de Dieta:</strong> 
            <div className="mt-2">
              {dieta.formulacionDieta ? (
                <Button 
                  variant="outline-primary"
                  size="sm"
                  onClick={handleViewFormulacion}
                >
                  <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '0.5rem' }} />
                  <FontAwesomeIcon icon={faEye} style={{ marginRight: '0.5rem' }} />
                  Ver PDF
                </Button>
              ) : (
                'No disponible'
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

export default ViewDietaModal;
