import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddMedidaMorfologicaModal = ({ show, handleClose, animalId, fichaClinicaId, user, onEventoCreado }) => {
  const [medidaMorfologica, setMedidaMorfologica] = useState({
    fecha: '',
    longitudTotal: '',
    longitudCabeza: '',
    longitudCola: '',
    peso: '',
    circunferenciaToracica: '',
    alturaCruz: '',
    observaciones: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedidaMorfologica(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró una ficha clínica activa', 'error');
        return;
      }

      const token = localStorage.getItem('token');
      const medidaMorfologicaData = {
        ...medidaMorfologica,
        fecha: new Date(medidaMorfologica.fecha).toISOString(),
        animalId,
        fichaClinicaId,
        creadoPor: user._id
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}medidas-morfologicas`,
        medidaMorfologicaData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        // Actualizar la ficha clínica con el ID de la medida morfológica
        await axios.put(
          `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`,
          { medidasMorfologicasId: response.data.medidasMorfologicasId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        Swal.fire('Éxito', 'Medida morfológica guardada correctamente', 'success');
        onEventoCreado(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error al crear medida morfológica:', error);
      Swal.fire('Error', 'No se pudo crear la medida morfológica', 'error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Medida Morfológica</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control 
              type="date" 
              name="fecha"
              value={medidaMorfologica.fecha}
              onChange={handleInputChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Longitud Total (cm)</Form.Label>
            <Form.Control 
              type="number" 
              step="0.1" 
              name="longitudTotal"
              value={medidaMorfologica.longitudTotal}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Longitud de la Cabeza (cm)</Form.Label>
            <Form.Control 
              type="number" 
              step="0.1" 
              name="longitudCabeza"
              value={medidaMorfologica.longitudCabeza}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Longitud de la Cola (cm)</Form.Label>
            <Form.Control 
              type="number" 
              step="0.1" 
              name="longitudCola"
              value={medidaMorfologica.longitudCola}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Peso (kg)</Form.Label>
            <Form.Control 
              type="number" 
              step="0.1" 
              name="peso"
              value={medidaMorfologica.peso}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Circunferencia Torácica (cm)</Form.Label>
            <Form.Control 
              type="number" 
              step="0.1" 
              name="circunferenciaToracica"
              value={medidaMorfologica.circunferenciaToracica}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Altura a la Cruz (cm)</Form.Label>
            <Form.Control 
              type="number" 
              step="0.1" 
              name="alturaCruz"
              value={medidaMorfologica.alturaCruz}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="observaciones"
              value={medidaMorfologica.observaciones}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Medida Morfológica
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddMedidaMorfologicaModal;