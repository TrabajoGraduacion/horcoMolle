import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const ViewEgresoModal = ({ show, handleClose, egreso }) => {
  if (!egreso) return null;

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg"
      enforceFocus={false}
      restoreFocus={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Ver Egreso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item><strong>Nombre del Animal:</strong> {egreso.nombreInstitucionalAnimal}</ListGroup.Item>
          <ListGroup.Item><strong>Número de Ficha:</strong> {egreso.numFicha}</ListGroup.Item>
          <ListGroup.Item><strong>Fecha de Egreso:</strong> {new Date(egreso.fechaEgreso).toLocaleDateString()}</ListGroup.Item>
          <ListGroup.Item><strong>Motivo de Egreso:</strong> {egreso.motivoEgreso}</ListGroup.Item>
          <ListGroup.Item>
            <strong>Lugar de Egreso:</strong>
            <ul>
              <li>Establecimiento: {egreso.lugarEgreso.establecimiento}</li>
              <li>Localidad: {egreso.lugarEgreso.localidad}</li>
              <li>Provincia: {egreso.lugarEgreso.provincia}</li>
            </ul>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Participación de Fauna:</strong> {egreso.participacionFauna.participacion ? 'Sí' : 'No'}
            {egreso.participacionFauna.participacion && (
              <div><strong>Razón:</strong> {egreso.participacionFauna.razon}</div>
            )}
          </ListGroup.Item>
          <ListGroup.Item><strong>Observaciones:</strong> {egreso.observaciones}</ListGroup.Item>
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

export default ViewEgresoModal;