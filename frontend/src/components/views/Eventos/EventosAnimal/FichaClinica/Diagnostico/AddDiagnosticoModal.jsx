import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddDiagnosticoModal = ({ show, handleClose, animalId, user, onEventoCreado }) => {
  const [diagnostico, setDiagnostico] = useState({
    fecha: '',
    tipoDiagnostico: '',
    diagnosticoPrincipal: '',
    diagnosticosSecundarios: '',
    recomendaciones: '',
    adjuntosUrls: []
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiagnostico(prev => ({
      ...prev,
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
      e.target.value = null;
      return;
    }

    setSelectedFiles(validFiles);
  };

  const uploadFileToCloudinary = async (file) => {
    const uploadPreset = 'unsigned_pdf_preset';
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    // Determinar el tipo de recurso basado en el tipo de archivo
    const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

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
      const fichaClinicaId = localStorage.getItem('fichaClinicaId');
      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró una ficha clínica activa', 'error');
        return;
      }

      // Subir archivos a Cloudinary y obtener URLs
      let adjuntosUrls = [];
      if (selectedFiles.length > 0) {
        try {
          const uploadPromises = selectedFiles.map(file => uploadFileToCloudinary(file));
          adjuntosUrls = await Promise.all(uploadPromises);
          console.log('URLs de archivos subidos:', adjuntosUrls);
        } catch (error) {
          console.error('Error al subir archivos:', error);
          Swal.fire('Error', 'No se pudieron subir algunos archivos', 'error');
          return;
        }
      }

      // Crear objeto de diagnóstico con las URLs de los archivos
      const diagnosticoData = {
        fecha: new Date(diagnostico.fecha).toISOString(),
        tipoDiagnostico: diagnostico.tipoDiagnostico,
        diagnosticoPrincipal: diagnostico.diagnosticoPrincipal,
        diagnosticosSecundarios: diagnostico.diagnosticosSecundarios,
        recomendaciones: diagnostico.recomendaciones,
        adjuntos: adjuntosUrls, // Asegurarnos de que este campo coincida con el modelo
        animalId: animalId,
        fichaClinicaId: fichaClinicaId,
        creadoPor: user._id
      };

      console.log('Datos del diagnóstico a enviar:', diagnosticoData);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const diagnosticoResponse = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}diagnostico`,
        diagnosticoData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Respuesta del servidor:', diagnosticoResponse.data);

      if (diagnosticoResponse.status === 201) {
        // Actualizar la ficha clínica
        await axios.put(
          `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`,
          { diagnosticoId: diagnosticoResponse.data.diagnosticoId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Actualizar eventos en localStorage
        const eventosActuales = JSON.parse(localStorage.getItem('eventosCreados') || '[]');
        const nuevosEventos = [...eventosActuales, {
          tipo: 'Diagnóstico',
          id: diagnosticoResponse.data._id,
          fecha: diagnosticoResponse.data.fecha,
          datos: {
            ...diagnosticoResponse.data,
            adjuntosUrls: adjuntosUrls // Asegurarnos de incluir las URLs en los datos guardados
          }
        }];
        localStorage.setItem('eventosCreados', JSON.stringify(nuevosEventos));

        if (typeof onEventoCreado === 'function') {
          onEventoCreado({
            ...diagnosticoResponse.data,
            adjuntosUrls: adjuntosUrls
          });
        }

        // Limpiar el formulario
        setDiagnostico({
          fecha: '',
          tipoDiagnostico: '',
          diagnosticoPrincipal: '',
          diagnosticosSecundarios: '',
          recomendaciones: '',
          adjuntosUrls: []
        });
        setSelectedFiles([]);

        Swal.fire('Éxito', 'Diagnóstico guardado correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error al crear diagnóstico:', error);
      Swal.fire('Error', 'No se pudo crear el diagnóstico', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Diagnóstico</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control 
              type="date" 
              name="fecha"
              value={diagnostico.fecha}
              onChange={handleInputChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Diagnóstico</Form.Label>
            <Form.Control 
              type="text" 
              name="tipoDiagnostico"
              value={diagnostico.tipoDiagnostico}
              onChange={handleInputChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Diagnóstico Principal</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="diagnosticoPrincipal"
              value={diagnostico.diagnosticoPrincipal}
              onChange={handleInputChange}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Diagnósticos Secundarios</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="diagnosticosSecundarios"
              value={diagnostico.diagnosticosSecundarios}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Recomendaciones</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="recomendaciones"
              value={diagnostico.recomendaciones}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adjuntos (PDF o Imágenes)</Form.Label>
            <Form.Control 
              type="file" 
              multiple 
              onChange={handleFileChange}
              accept=".pdf,image/*"
            />
            <Form.Text className="text-muted">
              Puede seleccionar múltiples archivos PDF o imágenes
            </Form.Text>
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? 'Guardando...' : 'Guardar Diagnóstico'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDiagnosticoModal;