import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../../../../context/AuthContext';

const AddObservacionDiariaModal = ({ show, handleClose, handleAdd }) => {
  const { user } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    comportamental: [],
    salud: [],
    ambiental: []
  });

  const [formData, setFormData] = useState({
    animalId: '',
    fechaObservacion: '',
    hora: '',
    duracion: '',
    contextoAmbiental: '',
    enfoqueComportamental: {
      actividad: '',
      social: '',
      comportamental: '',
      nutricion: '',
      manejo: '',
    },
    enfoqueSalud: {
      condicionFisica: '',
      discapacidad: '',
      condicionGeneral: '',
    },
    enfoqueAmbiental: {
      ambienteExterno: {
        tiempoPermanencia: '',
        higiene: '',
        seguridad: '',
      },
      ambienteInterno: {
        tiempoPermanencia: '',
        higiene: '',
        seguridad: '',
        bioseguridadManejador: '',
        bioseguridadAnimal: '',
      },
    },
    archivosAdjuntos: [],
    realizadoPor: user ? user._id : '',
    archivosEnfoqueComportamental: [],
    archivosEnfoqueSalud: [],
    archivosEnfoqueAmbiental: []
  });

  const [animales, setAnimales] = useState([]);

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}animales`);
        setAnimales(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de animales:', error);
      }
    };

    fetchAnimales();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNestedChange = (e, category, subcategory = null) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [subcategory ? subcategory : name]: subcategory
          ? { ...prevState[category][subcategory], [name]: value }
          : value
      }
    }));
  };

  const handleFileChange = (e, enfoque) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/')
    );

    if (validFiles.length !== files.length) {
      Swal.fire('Error', 'Solo se permiten archivos PDF e imágenes', 'error');
    }

    setSelectedFiles(prev => ({
      ...prev,
      [enfoque]: validFiles
    }));
  };

  const uploadFileToCloudinary = async (file) => {
    const uploadPreset = 'unsigned_preset'; // Reemplaza con tu upload preset
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error al subir archivo a Cloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Subir archivos para cada enfoque
      const uploadPromises = {
        comportamental: Promise.all(selectedFiles.comportamental.map(file => uploadFileToCloudinary(file))),
        salud: Promise.all(selectedFiles.salud.map(file => uploadFileToCloudinary(file))),
        ambiental: Promise.all(selectedFiles.ambiental.map(file => uploadFileToCloudinary(file)))
      };

      const uploadedUrls = await Promise.all([
        uploadPromises.comportamental,
        uploadPromises.salud,
        uploadPromises.ambiental
      ]);

      const observacionData = {
        ...formData,
        archivosEnfoqueComportamental: uploadedUrls[0],
        archivosEnfoqueSalud: uploadedUrls[1],
        archivosEnfoqueAmbiental: uploadedUrls[2]
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}observaciones-diarias`, 
        observacionData
      );

      handleAdd(response.data);
      handleClose();
      Swal.fire('Éxito', 'Observación diaria agregada correctamente', 'success');
    } catch (error) {
      console.error('Error al agregar la observación diaria:', error);
      Swal.fire('Error', 'No se pudo agregar la observación diaria', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Observación Diaria</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Animal</Form.Label>
            <Form.Select name="animalId" onChange={handleChange} required>
              <option value="">Seleccione un animal</option>
              {animales.map(animal => (
                <option key={animal._id} value={animal._id}>{animal.nombreInstitucional}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Observación</Form.Label>
            <Form.Control type="date" name="fechaObservacion" onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control type="time" name="hora" onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duración</Form.Label>
            <Form.Control type="text" name="duracion" onChange={handleChange} placeholder="HH:MM" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contexto Ambiental</Form.Label>
            <Form.Control as="textarea" name="contextoAmbiental" onChange={handleChange} required />
          </Form.Group>
          
          {/* Enfoque Comportamental */}
          <h5>Enfoque Comportamental</h5>
          <Form.Group className="mb-3">
            <Form.Label>Actividad</Form.Label>
            <Form.Control type="text" name="actividad" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Social</Form.Label>
            <Form.Control type="text" name="social" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comportamental</Form.Label>
            <Form.Control type="text" name="comportamental" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nutrición</Form.Label>
            <Form.Control type="text" name="nutricion" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Manejo</Form.Label>
            <Form.Control type="text" name="manejo" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} />
          </Form.Group>

          {/* Archivos Enfoque Comportamental */}
          <Form.Group className="mb-4">
            <Form.Label>Archivos Enfoque Comportamental</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, 'comportamental')}
              accept=".pdf,image/*"
            />
          </Form.Group>

          {/* Enfoque Salud */}
          <h5>Enfoque Salud</h5>
          <Form.Group className="mb-3">
            <Form.Label>Condición Física</Form.Label>
            <Form.Control type="text" name="condicionFisica" onChange={(e) => handleNestedChange(e, 'enfoqueSalud')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Discapacidad</Form.Label>
            <Form.Control type="text" name="discapacidad" onChange={(e) => handleNestedChange(e, 'enfoqueSalud')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Condición General</Form.Label>
            <Form.Control type="text" name="condicionGeneral" onChange={(e) => handleNestedChange(e, 'enfoqueSalud')} />
          </Form.Group>

          {/* Archivos Enfoque Salud */}
          <Form.Group className="mb-4">
            <Form.Label>Archivos Enfoque Salud</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, 'salud')}
              accept=".pdf,image/*"
            />
          </Form.Group>

          {/* Enfoque Ambiental */}
          <h5>Enfoque Ambiental</h5>
          <h6>Ambiente Externo</h6>
          <Form.Group className="mb-3">
            <Form.Label>Tiempo de Permanencia</Form.Label>
            <Form.Control type="text" name="tiempoPermanencia" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteExterno')} placeholder="HH:MM" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Higiene</Form.Label>
            <Form.Control type="text" name="higiene" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteExterno')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Seguridad</Form.Label>
            <Form.Control type="text" name="seguridad" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteExterno')} />
          </Form.Group>

          <h6>Ambiente Interno</h6>
          <Form.Group className="mb-3">
            <Form.Label>Tiempo de Permanencia</Form.Label>
            <Form.Control type="text" name="tiempoPermanencia" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} placeholder="HH:MM" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Higiene</Form.Label>
            <Form.Control type="text" name="higiene" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Seguridad</Form.Label>
            <Form.Control type="text" name="seguridad" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bioseguridad Manejador</Form.Label>
            <Form.Control type="text" name="bioseguridadManejador" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bioseguridad Animal</Form.Label>
            <Form.Control type="text" name="bioseguridadAnimal" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} />
          </Form.Group>

          {/* Archivos Enfoque Ambiental */}
          <Form.Group className="mb-4">
            <Form.Label>Archivos Enfoque Ambiental</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, 'ambiental')}
              accept=".pdf,image/*"
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? 'Guardando...' : 'Agregar Observación Diaria'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddObservacionDiariaModal;