import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Card, Image } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditEvaluacionModal = ({ show, onHide, eventId, onSubmit }) => {
  const [formData, setFormData] = useState({
    fechaEvaluacion: '',
    descripcion: '',
    condicionesAmbientales: '',
    condicionesBioseguridad: '',
    calidadDidactica: '',
    observaciones: '',
    fotografias: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    if (show && eventId) {
      loadEventData();
    }
  }, [show, eventId]);

  // Cargar datos de la evaluación al abrir el modal.
  const loadEventData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}evaluacion-recinto/${eventId}`);
      const eventData = response.data;
      console.log('Datos del evento cargados:', eventData);

      setFormData({
        fechaEvaluacion: eventData.fechaEvaluacion ? new Date(eventData.fechaEvaluacion).toISOString().split('T')[0] : '',
        descripcion: eventData.descripcion || '',
        condicionesAmbientales: eventData.condicionesAmbientales || '',
        condicionesBioseguridad: eventData.condicionesBioseguridad || '',
        calidadDidactica: eventData.calidadDidactica || '',
        observaciones: eventData.observaciones || '',
        fotografias: eventData.fotografias || [],
      });
      setDeletedImages([]);
      setSelectedImages([]);
    } catch (error) {
      console.error('Error al cargar los datos del evento:', error);
      Swal.fire('Error', 'No se pudieron cargar los datos del evento', 'error');
    }
  };

  // Actualizar los campos del formulario.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Eliminar una imagen del array de fotografias.
  const handleImageDelete = (url) => {
    setDeletedImages(prevDeleted => [...prevDeleted, url]);
    setFormData(prevState => ({
      ...prevState,
      fotografias: prevState.fotografias.filter(foto => foto !== url),
    }));
  };

  // Manejar la selección de nuevas imágenes para subir.
  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  // Subir las imágenes a Cloudinary y obtener las URLs.
  const handleImageUpload = async () => {
    const urls = [];
    const uploadPreset = 'unsigned_preset';
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
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
        console.error('Error al subir la imagen:', error);
        throw error;
      }
    }
    return urls;
  };

  // Enviar los datos al backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedUrls = [];
      if (selectedImages.length > 0) {
        uploadedUrls = await handleImageUpload();
      }

      const dataToSend = {
        ...formData,
        fechaEvaluacion: new Date(formData.fechaEvaluacion).toISOString(),
        fotografias: [...formData.fotografias, ...uploadedUrls],
      };

      console.log('Datos a enviar:', dataToSend);

      const response = await axios.put(`${import.meta.env.VITE_API_USUARIO}evaluacion-recinto/${eventId}`, dataToSend);

      console.log('Respuesta del servidor:', response.data);

      Swal.fire('¡Éxito!', 'Evaluación actualizada correctamente', 'success');
      onSubmit(response.data);
      onHide();
    } catch (error) {
      console.error('Error al actualizar la evaluación:', error);
      Swal.fire('Error', 'No se pudo actualizar la evaluación', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Renderizar las imágenes y el input para seleccionar nuevas imágenes.
  const renderFotos = () => (
    <Form.Group className="mt-4">
      <Form.Label>Fotografías de la Evaluación</Form.Label>
      {formData.fotografias.length > 0 && (
        <div className="d-flex flex-wrap">
          {formData.fotografias.map((foto, index) => (
            <Card key={index} className="m-2" style={{ width: '150px' }}>
              <Image
                src={foto}
                alt={`Foto ${index + 1}`}
                thumbnail
                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
              />
              <Button
                variant="danger"
                size="sm"
                className="mt-2"
                onClick={() => handleImageDelete(foto)}
              >
                Eliminar
              </Button>
            </Card>
          ))}
        </div>
      )}
      <Form.Control
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
    </Form.Group>
  );

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Evaluación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Evaluación</Form.Label>
            <Form.Control
              type="date"
              name="fechaEvaluacion"
              value={formData.fechaEvaluacion}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Condiciones Ambientales</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="condicionesAmbientales"
              value={formData.condicionesAmbientales}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Condiciones de Bioseguridad</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="condicionesBioseguridad"
              value={formData.condicionesBioseguridad}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Calidad Didáctica</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="calidadDidactica"
              value={formData.calidadDidactica}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
            />
          </Form.Group>
          {renderFotos()}
          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditEvaluacionModal
