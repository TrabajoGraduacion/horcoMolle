import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FichaClinicaContext } from '../../../../../../../context/FichaClinicaContext';

const EditEvolucionModal = ({ show, handleClose, eventoId, animalId, user, onEventoActualizado }) => {
  const [evolucion, setEvolucion] = useState({
    fecha: '',
    estadoGeneral: '',
    cambiosCondicion: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerEvolucion = async () => {
      try {
        if (eventoId) {
          setLoading(true);
          const response = await axios.get(
            `${import.meta.env.VITE_API_USUARIO}evolucion/${eventoId}`
          );
          
          const { fecha, estadoGeneral, cambiosCondicion } = response.data;
          
          setEvolucion({
            fecha: new Date(fecha).toISOString().split('T')[0],
            estadoGeneral: estadoGeneral || '',
            cambiosCondicion: cambiosCondicion || ''
          });
        }
      } catch (error) {
        console.error('Error al obtener evolución:', error);
        Swal.fire('Error', 'No se pudo obtener la evolución', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (show && eventoId) {
      obtenerEvolucion();
    }
  }, [show, eventoId]);

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
        Swal.fire('Error', 'No se encontró la ficha clínica activa', 'error');
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

      const response = await axios.put(
        `${import.meta.env.VITE_API_USUARIO}evolucion/${eventoId}`,
        evolucionData
      );

      if (response.status === 200) {
        onEventoActualizado(response.data);
        Swal.fire('Éxito', 'Evolución actualizada correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar la evolución', 'error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Evolución</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
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
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditEvolucionModal;
