import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const EditMedidaMorfologicaModal = ({ show, handleClose, eventoId, animalId, user, onEventoActualizado }) => {
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerMedidaMorfologica = async () => {
      try {
        if (eventoId) {
          setLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${import.meta.env.VITE_API_USUARIO}medidas-morfologicas/${eventoId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          const medidaData = response.data;
          
          let fechaFormateada = '';
          try {
            if (medidaData.fecha) {
              fechaFormateada = new Date(medidaData.fecha).toISOString().split('T')[0];
            }
          } catch (error) {
            console.error('Error al formatear la fecha:', error);
            fechaFormateada = '';
          }

          setMedidaMorfologica({
            fecha: fechaFormateada,
            longitudTotal: medidaData.longitudTotal || '',
            longitudCabeza: medidaData.longitudCabeza || '',
            longitudCola: medidaData.longitudCola || '',
            peso: medidaData.peso || '',
            circunferenciaToracica: medidaData.circunferenciaToracica || '',
            alturaCruz: medidaData.alturaCruz || '',
            observaciones: medidaData.observaciones || ''
          });
        }
      } catch (error) {
        console.error('Error al obtener medida morfológica:', error);
        Swal.fire('Error', 'No se pudo obtener la medida morfológica', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (show && eventoId) {
      obtenerMedidaMorfologica();
    }
  }, [show, eventoId]);

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
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_USUARIO}medidas-morfologicas/${eventoId}`,
        {
          ...medidaMorfologica,
          fecha: new Date(medidaMorfologica.fecha).toISOString(),
          animalId,
          actualizadoPor: user._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        Swal.fire('Éxito', 'Medida morfológica actualizada correctamente', 'success');
        onEventoActualizado(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error al actualizar medida morfológica:', error);
      Swal.fire('Error', 'No se pudo actualizar la medida morfológica', 'error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Medida Morfológica</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Cargando...</p>
        ) : (
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
                Actualizar Medida Morfológica
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditMedidaMorfologicaModal;
