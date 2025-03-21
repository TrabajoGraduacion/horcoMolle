import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

const EditRelocalizacionModal = ({ show, handleClose, handleEdit, relocalizacionToEdit }) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    animalId: '',
    recintoAnterior: '',
    recintoNuevo: '',
    fechaRelocalizacion: '',
    motivo: '',
    observaciones: '',
    archivos: []
  });
  const [animales, setAnimales] = useState([]);
  const [recintos, setRecintos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animalesRes, recintosRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_USUARIO}animales`),
          axios.get(`${import.meta.env.VITE_API_USUARIO}recintos`)
        ]);
        setAnimales(animalesRes.data);
        setRecintos(recintosRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'No se pudo cargar la información necesaria', 'error');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (relocalizacionToEdit) {
      setFormData({
        ...relocalizacionToEdit,
        animalId: relocalizacionToEdit.animalId._id || '',
        recintoAnterior: relocalizacionToEdit.recintoAnterior._id || '',
        recintoNuevo: relocalizacionToEdit.recintoNuevo._id || '',
        fechaRelocalizacion: new Date(relocalizacionToEdit.fechaRelocalizacion).toISOString().split('T')[0],
        motivo: relocalizacionToEdit.motivo || '',
        observaciones: relocalizacionToEdit.observaciones || '',
        archivos: relocalizacionToEdit.archivos || []
      });
    }
  }, [relocalizacionToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/')
    );

    if (validFiles.length !== files.length) {
      Swal.fire('Error', 'Solo se permiten archivos PDF e imágenes', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      nuevosArchivos: validFiles
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let archivosUrls = formData.archivos || [];

      // Subir nuevos archivos si existen
      if (formData.nuevosArchivos?.length > 0) {
        const uploadPromises = formData.nuevosArchivos.map(async file => {
          const formDataFile = new FormData();
          formDataFile.append('file', file);
          formDataFile.append('upload_preset', 'ml_default');
          
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
            formDataFile
          );
          
          return response.data.secure_url;
        });

        const nuevasUrls = await Promise.all(uploadPromises);
        archivosUrls = [...archivosUrls, ...nuevasUrls];
      }

      const dataToSend = {
        ...formData,
        archivos: archivosUrls
      };

      delete dataToSend.nuevosArchivos;

      const response = await axios.put(
        `${import.meta.env.VITE_API_USUARIO}relocalizacion/${relocalizacionToEdit._id}`,
        dataToSend
      );

      handleEdit(response.data);
      handleClose();
      Swal.fire('Éxito', 'Relocalización actualizada correctamente', 'success');
    } catch (error) {
      console.error('Error updating relocalizacion:', error);
      Swal.fire('Error', 'No se pudo actualizar la relocalización', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = (index) => {
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
        setFormData(prev => ({
          ...prev,
          archivos: prev.archivos.filter((_, i) => i !== index)
        }));
        Swal.fire('Eliminado', 'El archivo ha sido eliminado.', 'success');
      }
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Relocalización</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Animal</Form.Label>
            <Form.Select 
              name="animalId" 
              onChange={handleChange} 
              value={formData.animalId || ''}
              required
            >
              <option value="">Seleccionar animal</option>
              {animales.map(animal => (
                <option key={animal._id} value={animal._id}>
                  {animal.nombreInstitucional}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Recinto Anterior</Form.Label>
            <Form.Select 
              name="recintoAnterior" 
              onChange={handleChange}
              value={formData.recintoAnterior || ''}
              required
            >
              <option value="">Seleccionar recinto</option>
              {recintos.map(recinto => (
                <option key={recinto._id} value={recinto._id}>
                  {recinto.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Recinto Nuevo</Form.Label>
            <Form.Select 
              name="recintoNuevo" 
              onChange={handleChange}
              value={formData.recintoNuevo || ''}
              required
            >
              <option value="">Seleccionar recinto</option>
              {recintos.map(recinto => (
                <option key={recinto._id} value={recinto._id}>
                  {recinto.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Relocalización</Form.Label>
            <Form.Control
              type="date"
              name="fechaRelocalizacion"
              value={formData.fechaRelocalizacion || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Motivo</Form.Label>
            <Form.Control
              type="text"
              name="motivo"
              value={formData.motivo || ''}
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
              value={formData.observaciones || ''}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Archivos Actuales</Form.Label>
            {formData.archivos?.length > 0 ? (
              <div className="mb-2">
                {formData.archivos.map((url, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <p className="mb-0 me-2">Archivo {index + 1}</p>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => window.open(url, '_blank')} 
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faEye} /> Ver
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDeleteFile(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No hay archivos</p>
            )}

            <Form.Label>Agregar Nuevos Archivos</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,image/*"
            />
            <Form.Text className="text-muted">
              Puede seleccionar múltiples archivos (PDF o imágenes)
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? 'Guardando...' : 'Actualizar Relocalización'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditRelocalizacionModal;