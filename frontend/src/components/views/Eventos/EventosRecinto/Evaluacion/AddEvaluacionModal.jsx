import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { AuthContext } from '../../../../../../context/AuthContext'; 

const AddEvaluacionModal = ({ show, handleClose, handleAdd }) => {
  const { user } = useContext(AuthContext);
  const [evaluacion, setEvaluacion] = useState({
    recintoId: '',
    fechaEvaluacion: '',
    descripcion: '',
    condicionesAmbientales: '',
    condicionesBioseguridad: '',
    calidadDidactica: '',
    observaciones: '',
    fotografias: [],
    realizadoPor: user ? user._id : '',
  });

  const [recintos, setRecintos] = useState([]);
  const [selectedFotos, setSelectedFotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchRecintos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}recintos`);
        setRecintos(response.data.map(recinto => ({
          value: recinto._id,
          label: recinto.nombre
        })));
      } catch (error) {
        console.error('Error al obtener los recintos:', error);
      }
    };

    fetchRecintos();
  }, []);

  useEffect(() => {
    if (user) {
      setEvaluacion(prev => ({ ...prev, realizadoPor: user._id }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluacion(prev => ({ ...prev, [name]: value }));
  };

  const handleRecintoChange = (selectedOption) => {
    setEvaluacion(prev => ({ ...prev, recintoId: selectedOption.value }));
  };

  const handleFileChange = (e) => {
    setSelectedFotos(Array.from(e.target.files));
  };

  const uploadToCloudinary = async (files) => {
    const uploadPreset = 'unsigned_preset'; // Reemplaza con tu Upload Preset
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const urls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        urls.push(data.secure_url);
      } catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error);
        throw error;
      }
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fotoUrls = [];

      if (selectedFotos.length > 0) {
        fotoUrls = await uploadToCloudinary(selectedFotos);
      }

      const evaluacionData = {
        ...evaluacion,
        fotografias: fotoUrls,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_USUARIO}evaluacion-recinto`, evaluacionData);
      
      if (response.status === 201) {
        Swal.fire('¡Éxito!', 'Evaluación creada con éxito', 'success');
        handleAdd(response.data.evaluacion);
        handleClose();
      }
    } catch (error) {
      console.error('Error al crear la evaluación:', error);
      Swal.fire('Error', `No se pudo crear la evaluación: ${error.response?.data?.message || error.message}`, 'error');
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
        <Modal.Title>Nueva Evaluación de Recinto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Recinto</Form.Label>
            <Select
              options={recintos}
              onChange={handleRecintoChange}
              placeholder="Seleccione un recinto"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Evaluación</Form.Label>
            <Form.Control
              type="date"
              name="fechaEvaluacion"
              value={evaluacion.fechaEvaluacion}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={evaluacion.descripcion}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Condiciones Ambientales</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="condicionesAmbientales"
              value={evaluacion.condicionesAmbientales}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Condiciones de Bioseguridad</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="condicionesBioseguridad"
              value={evaluacion.condicionesBioseguridad}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Calidad Didáctica</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="calidadDidactica"
              value={evaluacion.calidadDidactica}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones"
              value={evaluacion.observaciones}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fotografías</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? 'Guardando...' : 'Guardar Evaluación'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEvaluacionModal;
