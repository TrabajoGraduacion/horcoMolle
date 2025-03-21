import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { AuthContext } from '../../../../../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const EditEnriquecimientoModal = ({ show, handleClose, handleEdit, enriquecimientoToEdit }) => {
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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (enriquecimientoToEdit) {
      setEnriquecimiento({
        ...enriquecimientoToEdit,
        fechaEnriquecimiento: new Date(enriquecimientoToEdit.fechaEnriquecimiento).toISOString().split('T')[0],
      });
    }
  }, [enriquecimientoToEdit]);

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

  const handleDeletePlan = () => {
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
        setEnriquecimiento(prev => ({ ...prev, fotosArchivos: [] }));
        setSelectedFile(null);
        Swal.fire(
          'Eliminado',
          'El archivo ha sido eliminado.',
          'success'
        );
      }
    });
  };

  const handleViewPlan = () => {
    if (enriquecimiento.fotosArchivos && enriquecimiento.fotosArchivos.length > 0) {
      window.open(enriquecimiento.fotosArchivos[0], '_blank');
    }
  };

  const uploadFileToCloudinary = async (file) => {
    const uploadPreset = 'unsigned_pdf_preset';
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
    setUploading(true);

    try {
      let fotosArchivos = [...enriquecimiento.fotosArchivos];
      if (selectedFile) {
        const planEnriquecimientoUrl = await uploadFileToCloudinary(selectedFile);
        fotosArchivos = [planEnriquecimientoUrl, ...fotosArchivos];
      }

      const enriquecimientoData = {
        ...enriquecimiento,
        fotosArchivos
      };

      const response = await axios.put(`${import.meta.env.VITE_API_USUARIO}enriquecimiento/${enriquecimiento._id}`, enriquecimientoData);
      
      if (response.status === 200) {
        Swal.fire('¡Éxito!', 'Enriquecimiento actualizado con éxito', 'success');
        handleEdit(response.data.enriquecimiento);
        handleClose();
      }
    } catch (error) {
      console.error('Error al actualizar el enriquecimiento:', error);
      Swal.fire('Error', `No se pudo actualizar el enriquecimiento: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Enriquecimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Animal</Form.Label>
            <Select
              options={animales}
              onChange={handleAnimalChange}
              value={animales.find(animal => animal.value === enriquecimiento.animalId)}
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
            {enriquecimiento.fotosArchivos && enriquecimiento.fotosArchivos.length > 0 ? (
              <div className="d-flex align-items-center">
                <p className="mb-0 me-2">Archivo actual: {enriquecimiento.fotosArchivos[0].split('/').pop()}</p>
                <Button variant="outline-primary" size="sm" onClick={handleViewPlan} className="me-2">
                  <FontAwesomeIcon icon={faEye} /> Ver
                </Button>
                <Button variant="outline-danger" size="sm" onClick={handleDeletePlan}>
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
            {uploading ? 'Actualizando...' : 'Actualizar Enriquecimiento'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditEnriquecimientoModal;