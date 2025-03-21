import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { AuthContext } from '../../../../../../context/AuthContext'; 

const AddDietaModal = ({ show, handleClose, handleAdd }) => {
  const { user } = useContext(AuthContext);
  const [dieta, setDieta] = useState({
    especie: '',
    animalId: '',
    fechaInicio: '',
    estacion: '',
    kcalRequeridasSP: '',
    kcalDieta: '',
    observaciones: '',
    creadoPor: user ? user._id : '',
  });
  const [animales, setAnimales] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [seleccionTipo, setSeleccionTipo] = useState('animal');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}animales`);
        const opcionesAnimales = response.data.map(animal => ({
          value: animal._id,
          label: `${animal.nombreVulgar} - ${animal.nombreInstitucional}`,
          nombreCientifico: animal.nombreCientifico
        }));
        setAnimales(opcionesAnimales);

        // Extraer especies únicas (nombreCientifico)
        const especiesUnicas = [...new Set(response.data.map(animal => animal.nombreCientifico))];
        const opcionesEspecies = especiesUnicas.map(especie => ({
          value: especie,
          label: especie
        }));
        setEspecies(opcionesEspecies);
      } catch (error) {
        console.error('Error al obtener los animales:', error);
      }
    };

    fetchAnimales();
  }, []);

  useEffect(() => {
    if (user) {
      setDieta(prev => ({ ...prev, creadoPor: user._id }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDieta(prev => ({ ...prev, [name]: value }));
  };

  const handleAnimalChange = (selectedOption) => {
    setDieta(prev => ({ 
      ...prev, 
      animalId: selectedOption ? selectedOption.value : '',
      especie: selectedOption ? selectedOption.nombreCientifico : ''
    }));
  };

  const handleEspecieChange = (selectedOption) => {
    setDieta(prev => ({ 
      ...prev, 
      especie: selectedOption ? selectedOption.value : '',
      animalId: ''
    }));
  };

  const handleSeleccionTipoChange = (e) => {
    const nuevoTipo = e.target.value;
    setSeleccionTipo(nuevoTipo);
    setDieta(prev => ({
      ...prev,
      animalId: '',
      especie: ''
    }));
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
    const uploadPreset = 'unsigned_pdf_preset'; // Reemplaza con tu upload preset
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('resource_type', 'raw'); // Importante para PDFs

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error al subir el archivo a Cloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let formulacionDietaUrl = '';
      if (selectedFile) {
        formulacionDietaUrl = await uploadFileToCloudinary(selectedFile);
      }

      const dietaData = {
        ...dieta,
        formulacionDieta: formulacionDietaUrl
      };

      if (seleccionTipo === 'especie') {
        delete dietaData.animalId;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.post(`${import.meta.env.VITE_API_USUARIO}dietas`, dietaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 201) {
        Swal.fire('¡Éxito!', 'Dieta creada con éxito', 'success');
        handleAdd(response.data.dieta);
        handleClose();
      }
    } catch (error) {
      console.error('Error al crear la dieta:', error);
      Swal.fire('Error', `No se pudo crear la dieta: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setUploading(false);
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
        <Modal.Title>Nueva Dieta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Seleccionar por:</Form.Label>
            <Form.Control
              as="select"
              value={seleccionTipo}
              onChange={handleSeleccionTipoChange}
            >
              <option value="animal">Animal</option>
              <option value="especie">Especie</option>
            </Form.Control>
          </Form.Group>

          {seleccionTipo === 'animal' ? (
            <Form.Group className="mb-3">
              <Form.Label>Animal</Form.Label>
              <Select
                options={animales}
                onChange={handleAnimalChange}
                placeholder="Seleccione un animal"
                value={animales.find(option => option.value === dieta.animalId) || null}
                isClearable
              />
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Especie</Form.Label>
              <Select
                options={especies}
                onChange={handleEspecieChange}
                placeholder="Seleccione una especie"
                value={especies.find(option => option.value === dieta.especie) || null}
                isClearable
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Inicio</Form.Label>
            <Form.Control
              type="date"
              name="fechaInicio"
              value={dieta.fechaInicio}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estación</Form.Label>
            <Form.Control
              as="select"
              name="estacion"
              value={dieta.estacion}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una estación</option>
              <option value="Verano">Verano</option>
              <option value="Otoño">Otoño</option>
              <option value="Invierno">Invierno</option>
              <option value="Primavera">Primavera</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Kcal Requeridas por Especie</Form.Label>
            <Form.Control
              type="number"
              name="kcalRequeridasSP"
              value={dieta.kcalRequeridasSP}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Kcal de la Dieta</Form.Label>
            <Form.Control
              type="number"
              name="kcalDieta"
              value={dieta.kcalDieta}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones"
              value={dieta.observaciones}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Formulación de Dieta (PDF)</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? 'Guardando...' : 'Guardar Dieta'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDietaModal;
