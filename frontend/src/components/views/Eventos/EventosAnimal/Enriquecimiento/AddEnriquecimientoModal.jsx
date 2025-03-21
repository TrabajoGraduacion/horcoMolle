import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { AuthContext } from '../../../../../../context/AuthContext';

const AddEnriquecimientoModal = ({ show, handleClose, handleAdd }) => {
  const { user } = useContext(AuthContext);
  const [enriquecimiento, setEnriquecimiento] = useState({
    animalId: '',
    observador: user ? user._id : '',
    fechaEnriquecimiento: '',
    horaInicio: '',
    duracion: '',
    clima: '',
    temperatura: '',
    humedad: '',
    contexto: '',
    tipoEnriquecimiento: '',
    comportamiento: '',
    intensidad: '',
    notasAdicionales: '',
    resultados: '',
    fotosArchivos: [],
    creadoPor: user ? user._id : '',
  });

  const [animales, setAnimales] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

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
    setEnriquecimiento(prev => ({ ...prev, [name]: value }));
  };

  const handleAnimalChange = (selectedOption) => {
    setEnriquecimiento(prev => ({ ...prev, animalId: selectedOption.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      Swal.fire('Error', 'Por favor, seleccione un archivo PDF', 'error');
      e.target.value = null;
    }
  };

  const uploadFileToCloudinary = async (file) => {
    const uploadPreset = 'unsigned_pdf_preset'; // Asegúrate de que sea el mismo que en AddDietaModal
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('resource_type', 'raw');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir el archivo a Cloudinary');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let planEnriquecimientoUrl = '';
      if (selectedFile) {
        planEnriquecimientoUrl = await uploadFileToCloudinary(selectedFile);
      }

      const enriquecimientoData = {
        ...enriquecimiento,
        fotosArchivos: planEnriquecimientoUrl ? [planEnriquecimientoUrl] : []
      };

      const response = await axios.post(`${import.meta.env.VITE_API_USUARIO}enriquecimiento`, enriquecimientoData);
      if (response.status === 201) {
        Swal.fire('¡Éxito!', 'Enriquecimiento creado con éxito', 'success');
        handleAdd(response.data.enriquecimiento);
        handleClose();
      }
    } catch (error) {
      console.error('Error al crear el enriquecimiento:', error);
      Swal.fire('Error', `No se pudo crear el enriquecimiento: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Enriquecimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Animal</Form.Label>
            <Select
              options={animales}
              onChange={handleAnimalChange}
              placeholder="Seleccione un animal"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Enriquecimiento</Form.Label>
            <Form.Control
              type="date"
              name="fechaEnriquecimiento"
              value={enriquecimiento.fechaEnriquecimiento}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora de Inicio</Form.Label>
            <Form.Control
              type="time"
              name="horaInicio"
              value={enriquecimiento.horaInicio}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duración</Form.Label>
            <Form.Control
              type="text"
              name="duracion"
              value={enriquecimiento.duracion}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Clima</Form.Label>
            <Form.Control
              type="text"
              name="clima"
              value={enriquecimiento.clima}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Temperatura</Form.Label>
            <Form.Control
              type="text"
              name="temperatura"
              value={enriquecimiento.temperatura}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Humedad</Form.Label>
            <Form.Control
              type="text"
              name="humedad"
              value={enriquecimiento.humedad}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contexto</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="contexto"
              value={enriquecimiento.contexto}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Enriquecimiento</Form.Label>
            <Form.Control
              type="text"
              name="tipoEnriquecimiento"
              value={enriquecimiento.tipoEnriquecimiento}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comportamiento</Form.Label>
            <Form.Control
              type="text"
              name="comportamiento"
              value={enriquecimiento.comportamiento}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Intensidad</Form.Label>
            <Form.Control
              type="text"
              name="intensidad"
              value={enriquecimiento.intensidad}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notas Adicionales</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notasAdicionales"
              value={enriquecimiento.notasAdicionales}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Resultados</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="resultados"
              value={enriquecimiento.resultados}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Plan de Enriquecimiento (PDF)</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar Enriquecimiento
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEnriquecimientoModal;
