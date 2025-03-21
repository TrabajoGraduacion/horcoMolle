import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { AuthContext } from '../../../../../../context/AuthContext'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const EditDietaModal = ({ show, handleClose, handleEdit, dietaToEdit }) => {
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
    formulacionDieta: '',
  });
  const [animales, setAnimales] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [seleccionTipo, setSeleccionTipo] = useState('animal');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (dietaToEdit) {
      setDieta({
        ...dietaToEdit,
        fechaInicio: new Date(dietaToEdit.fechaInicio).toISOString().split('T')[0],
      });
      setSeleccionTipo(dietaToEdit.animalId ? 'animal' : 'especie');
    }
  }, [dietaToEdit]);

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
      animalId: '' // Aseguramos que animalId se vacíe cuando se selecciona una especie
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

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error al subir el archivo a Cloudinary:', error);
      throw error;
    }
  };

  const handleDeleteFormulacion = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setDieta(prev => ({ ...prev, formulacionDieta: '' }));
        setSelectedFile(null);
        Swal.fire(
          'Eliminado',
          'El archivo ha sido eliminado.',
          'success'
        );
      }
    });
  };

  const handleViewFormulacion = () => {
    window.open(dieta.formulacionDieta, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let formulacionDietaUrl = dieta.formulacionDieta;
      if (selectedFile) {
        formulacionDietaUrl = await uploadFileToCloudinary(selectedFile);
      }

      let dietaData = {
        ...dieta,
        formulacionDieta: formulacionDietaUrl,
        animalId: seleccionTipo === 'especie' ? '' : dieta.animalId // Aseguramos que animalId sea vacío para especie
      };

      if (seleccionTipo === 'animal') {
        // Si se selecciona animal, nos aseguramos de que especie sea el nombreCientifico del animal
        const animalSeleccionado = animales.find(animal => animal.value === dietaData.animalId);
        if (animalSeleccionado) {
          dietaData.especie = animalSeleccionado.nombreCientifico;
        }
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.put(`${import.meta.env.VITE_API_USUARIO}dietas/${dieta._id}`, dietaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        Swal.fire('¡Éxito!', 'Dieta actualizada con éxito', 'success');
        handleEdit(response.data.dieta);
        handleClose();
      }
    } catch (error) {
      console.error('Error al actualizar la dieta:', error);
      Swal.fire('Error', `No se pudo actualizar la dieta: ${error.response?.data?.message || error.message}`, 'error');
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
        <Modal.Title>Editar Dieta</Modal.Title>
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
            {dieta.formulacionDieta ? (
              <div className="d-flex align-items-center">
                <p className="mb-0 me-2">Archivo actual: {dieta.formulacionDieta.split('/').pop()}</p>
                <Button variant="outline-primary" size="sm" onClick={handleViewFormulacion} className="me-2">
                  <FontAwesomeIcon icon={faEye} /> Ver
                </Button>
                <Button variant="outline-danger" size="sm" onClick={handleDeleteFormulacion}>
                  <FontAwesomeIcon icon={faTrash} /> Eliminar
                </Button>
              </div>
            ) : (
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
              />
            )}
          </Form.Group>
          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? 'Actualizando...' : 'Actualizar Dieta'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditDietaModal;
