import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { AuthContext } from '../../../../../../context/AuthContext';

const EditEgresoModal = ({ show, handleClose, handleEdit, egresoToEdit }) => {
  const { user } = useContext(AuthContext);
  const [egreso, setEgreso] = useState({
    animalId: '',
    numFicha: '',
    fechaEgreso: '',
    motivoEgreso: '',
    lugarEgreso: {
      establecimiento: '',
      localidad: '',
      provincia: ''
    },
    participacionFauna: {
      participacion: false,
      razon: ''
    },
    observaciones: '',
    creadoPor: user ? user._id : '',
  });

  const [animales, setAnimales] = useState([]);

  useEffect(() => {
    if (egresoToEdit) {
      setEgreso({
        ...egresoToEdit,
        fechaEgreso: new Date(egresoToEdit.fechaEgreso).toISOString().split('T')[0],
      });
    }
  }, [egresoToEdit]);

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}animales`);
        const opcionesAnimales = response.data.map(animal => ({
          value: animal._id,
          label: `${animal.nombreVulgar} - ${animal.nombreInstitucional}`
        }));
        setAnimales(opcionesAnimales);
      } catch (error) {
        console.error('Error al obtener los animales:', error);
      }
    };

    fetchAnimales();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEgreso(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEgreso(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAnimalChange = (selectedOption) => {
    setEgreso(prev => ({ ...prev, animalId: selectedOption.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const egresoData = { ...egreso };
    
    if (egresoData.fechaEgreso) {
      egresoData.fechaEgreso = new Date(egresoData.fechaEgreso).toISOString();
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_USUARIO}egresos/${egreso._id}`, egresoData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 200) {
        Swal.fire('¡Éxito!', 'Egreso actualizado con éxito', 'success');
        handleEdit(response.data.egreso);
        handleClose();
      }
    } catch (error) {
      console.error('Error al actualizar el egreso:', error);
      Swal.fire('Error', `No se pudo actualizar el egreso: ${error.response?.data?.message || error.message}`, 'error');
    }
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
        <Modal.Title>Editar Egreso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Animal</Form.Label>
            <Select
              options={animales}
              onChange={handleAnimalChange}
              value={animales.find(animal => animal.value === egreso.animalId)}
              placeholder="Seleccione un animal"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Número de Ficha</Form.Label>
            <Form.Control
              type="text"
              name="numFicha"
              value={egreso.numFicha}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Egreso</Form.Label>
            <Form.Control
              type="date"
              name="fechaEgreso"
              value={egreso.fechaEgreso}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Motivo de Egreso</Form.Label>
            <Form.Control
              as="select"
              name="motivoEgreso"
              value={egreso.motivoEgreso}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un motivo</option>
              <option value="Liberación">Liberación</option>
              <option value="Escape">Escape</option>
              <option value="Muerte">Muerte</option>
              <option value="Eutanasia">Eutanasia</option>
              <option value="Derivación">Derivación</option>
              <option value="Canje">Canje</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lugar de Egreso</Form.Label>
            <Form.Control
              type="text"
              name="lugarEgreso.establecimiento"
              value={egreso.lugarEgreso.establecimiento}
              onChange={handleChange}
              placeholder="Establecimiento"
              required
            />
            <Form.Control
              type="text"
              name="lugarEgreso.localidad"
              value={egreso.lugarEgreso.localidad}
              onChange={handleChange}
              placeholder="Localidad"
              required
            />
            <Form.Control
              type="text"
              name="lugarEgreso.provincia"
              value={egreso.lugarEgreso.provincia}
              onChange={handleChange}
              placeholder="Provincia"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Participación de Fauna"
              name="participacionFauna.participacion"
              checked={egreso.participacionFauna.participacion}
              onChange={(e) => setEgreso(prev => ({
                ...prev,
                participacionFauna: {
                  ...prev.participacionFauna,
                  participacion: e.target.checked
                }
              }))}
            />
            {egreso.participacionFauna.participacion && (
              <Form.Control
                type="text"
                name="participacionFauna.razon"
                value={egreso.participacionFauna.razon}
                onChange={handleChange}
                placeholder="Razón de la participación"
              />
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones"
              value={egreso.observaciones}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Actualizar Egreso
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditEgresoModal;