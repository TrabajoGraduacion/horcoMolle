import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddEvolucionModal = ({ show, handleClose, animalId, user, onEventoCreado }) => {
  const [evolucion, setEvolucion] = useState({
    fecha: '',
    estadoGeneral: '',
    cambiosCondicion: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvolucion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fichaClinicaId = localStorage.getItem('fichaClinicaId');
      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró una ficha clínica activa', 'error');
        return;
      }

      const evolucionData = {
        fecha: new Date(evolucion.fecha).toISOString(),
        estadoGeneral: evolucion.estadoGeneral,
        cambiosCondicion: evolucion.cambiosCondicion,
        animalId: animalId,
        fichaClinicaId: fichaClinicaId,
        creadoPor: user._id
      };

      const evolucionResponse = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}evolucion`,
        evolucionData
      );

      if (evolucionResponse.status === 201) {
        // Actualizar la ficha clínica con el ID de la evolución
        await axios.put(
          `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`,
          { evolucionId: evolucionResponse.data.evolucionId }
        );

        // Actualizar eventos en localStorage si es necesario
        const eventosActuales = JSON.parse(localStorage.getItem('eventosCreados') || '[]');
        const nuevosEventos = [...eventosActuales, {
          tipo: 'Evolución',
          id: evolucionResponse.data.evolucionId,
          fecha: evolucionResponse.data.fecha,
          datos: evolucionResponse.data
        }];
        localStorage.setItem('eventosCreados', JSON.stringify(nuevosEventos));

        onEventoCreado(evolucionResponse.data);
        
        // Limpiar el formulario
        setEvolucion({
          fecha: '',
          estadoGeneral: '',
          cambiosCondicion: ''
        });

        Swal.fire('Éxito', 'Evolución guardada correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error al crear evolución:', error);
      Swal.fire('Error', 'No se pudo crear la evolución', 'error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Evolución</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control 
              type="date" 
              name="fecha"
              value={evolucion.fecha}
              onChange={handleInputChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado General</Form.Label>
            <Form.Select 
              name="estadoGeneral"
              value={evolucion.estadoGeneral}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Malo">Malo</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cambios en la Condición</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="cambiosCondicion"
              value={evolucion.cambiosCondicion}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Evolución
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEvolucionModal;