import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const EditDiagnosticoModal = ({ show, handleClose, eventoId, animalId, user, onEventoActualizado }) => {
  const [diagnostico, setDiagnostico] = useState({
    fecha: '',
    tipoDiagnostico: '',
    diagnosticoPrincipal: '',
    diagnosticosSecundarios: '',
    recomendaciones: '',
    adjuntos: []
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDiagnostico = async () => {
      try {
        if (eventoId) {
          setLoading(true);
          const response = await axios.get(
            `${import.meta.env.VITE_API_USUARIO}diagnostico/${eventoId}`
          );
          
          const diagnosticoData = response.data;
          setDiagnostico({
            ...diagnosticoData,
            fecha: new Date(diagnosticoData.fecha).toISOString().split('T')[0],
            adjuntos: diagnosticoData.adjuntos || []
          });
        }
      } catch (error) {
        console.error('Error al obtener diagnóstico:', error);
        Swal.fire('Error', 'No se pudo obtener el diagnóstico', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (show && eventoId) {
      obtenerDiagnostico();
    }
  }, [show, eventoId]);

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

  const handleDeleteAdjunto = (urlToDelete) => {
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
        setDiagnostico(prev => ({
          ...prev,
          adjuntos: prev.adjuntos.filter(url => url !== urlToDelete)
        }));
        Swal.fire(
          'Eliminado',
          'El archivo ha sido eliminado.',
          'success'
        );
      }
    });
  };

  const handleViewAdjunto = (url) => {
    window.open(url, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const fichaClinicaId = localStorage.getItem('fichaClinicaId');
      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró la ficha clínica activa', 'error');
        return;
      }

      let nuevasUrls = [];
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => uploadFileToCloudinary(file));
        nuevasUrls = await Promise.all(uploadPromises);
      }

      const todasLasUrls = [...diagnostico.adjuntos, ...nuevasUrls];

      const diagnosticoData = {
        fecha: new Date(diagnostico.fecha).toISOString(),
        tipoDiagnostico: diagnostico.tipoDiagnostico,
        diagnosticoPrincipal: diagnostico.diagnosticoPrincipal,
        diagnosticosSecundarios: diagnostico.diagnosticosSecundarios,
        recomendaciones: diagnostico.recomendaciones,
        adjuntos: todasLasUrls,
        animalId: animalId,
        fichaClinicaId: fichaClinicaId,
        creadoPor: user._id
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_USUARIO}diagnostico/${eventoId}`,
        diagnosticoData
      );

      if (response.status === 200) {
        onEventoActualizado(response.data);
        Swal.fire('Éxito', 'Diagnóstico actualizado correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error al actualizar diagnóstico:', error);
      Swal.fire('Error', 'No se pudo actualizar el diagnóstico', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Diagnóstico</Modal.Title>
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
            {diagnostico.adjuntos && diagnostico.adjuntos.length > 0 ? (
              <div>
                {diagnostico.adjuntos.map((url, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <p className="mb-0 me-2">Archivo {index + 1}: {url.split('/').pop()}</p>
                    <Button variant="outline-primary" size="sm" onClick={() => handleViewAdjunto(url)} className="me-2">
                      <FontAwesomeIcon icon={faEye} /> Ver
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteAdjunto(url)}>
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
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
              {uploading ? 'Actualizando...' : 'Actualizar Diagnóstico'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditDiagnosticoModal;
