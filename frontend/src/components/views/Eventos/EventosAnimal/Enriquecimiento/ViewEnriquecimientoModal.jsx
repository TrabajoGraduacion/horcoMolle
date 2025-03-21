import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ViewEnriquecimientoModal = ({ show, handleClose, enriquecimiento }) => {
  const [animalNombre, setAnimalNombre] = useState('');
  const [observadorNombre, setObservadorNombre] = useState('');

  useEffect(() => {
    if (enriquecimiento) {
      fetchAnimalNombre();
      fetchUsuarioNombre(enriquecimiento.observador, setObservadorNombre);
    }
  }, [enriquecimiento]);

  const fetchAnimalNombre = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}animales/${enriquecimiento.animalId}`);
      setAnimalNombre(`${response.data.nombreVulgar} - ${response.data.nombreInstitucional}`);
    } catch (error) {
      console.error('Error al obtener el nombre del animal:', error);
      setAnimalNombre('Nombre no disponible');
    }
  };

  const fetchUsuarioNombre = async (userId, setNombre) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}usuarios/${userId}`);
      setNombre(`${response.data.nombre} ${response.data.apellido}`);
    } catch (error) {
      console.error('Error al obtener el nombre del usuario:', error);
      setNombre('Nombre no disponible');
    }
  };

  const handleViewPlan = () => {
    if (enriquecimiento.fotosArchivos && enriquecimiento.fotosArchivos.length > 0) {
      window.open(enriquecimiento.fotosArchivos[0], '_blank');
    }
  };

  if (!enriquecimiento) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ver Enriquecimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item><strong>Animal:</strong> {animalNombre}</ListGroup.Item>
          <ListGroup.Item><strong>Observador:</strong> {observadorNombre}</ListGroup.Item>
          <ListGroup.Item><strong>Fecha de Enriquecimiento:</strong> {new Date(enriquecimiento.fechaEnriquecimiento).toLocaleDateString()}</ListGroup.Item>
          <ListGroup.Item><strong>Hora de Inicio:</strong> {enriquecimiento.horaInicio}</ListGroup.Item>
          <ListGroup.Item><strong>Duración:</strong> {enriquecimiento.duracion}</ListGroup.Item>
          <ListGroup.Item><strong>Clima:</strong> {enriquecimiento.clima}</ListGroup.Item>
          <ListGroup.Item><strong>Temperatura:</strong> {enriquecimiento.temperatura}</ListGroup.Item>
          <ListGroup.Item><strong>Humedad:</strong> {enriquecimiento.humedad}</ListGroup.Item>
          <ListGroup.Item><strong>Contexto:</strong> {enriquecimiento.contexto}</ListGroup.Item>
          <ListGroup.Item><strong>Tipo de Enriquecimiento:</strong> {enriquecimiento.tipoEnriquecimiento}</ListGroup.Item>
          <ListGroup.Item><strong>Comportamiento:</strong> {enriquecimiento.comportamiento}</ListGroup.Item>
          <ListGroup.Item><strong>Intensidad:</strong> {enriquecimiento.intensidad}</ListGroup.Item>
          <ListGroup.Item><strong>Notas Adicionales:</strong> {enriquecimiento.notasAdicionales}</ListGroup.Item>
          <ListGroup.Item><strong>Resultados:</strong> {enriquecimiento.resultados}</ListGroup.Item>
          <ListGroup.Item>
            <strong>Plan de Enriquecimiento:</strong> 
            {enriquecimiento.fotosArchivos && enriquecimiento.fotosArchivos.length > 0 ? (
              <Button 
                variant="outline-primary"
                size="sm"
                onClick={handleViewPlan}
                className="ms-2"
              >
                <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                <FontAwesomeIcon icon={faEye} className="me-2" />
                Ver PDF
              </Button>
            ) : (
              ' No disponible'
            )}
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

export default ViewEnriquecimientoModal;
