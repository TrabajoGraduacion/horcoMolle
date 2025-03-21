import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const EditMetodoComplementarioModal = ({ show, handleClose, eventoId, animalId, user, onEventoActualizado }) => {
  const [metodoComplementario, setMetodoComplementario] = useState({
    fecha: '',
    tipoExamen: '',
    metodo: '',
    tomaMuestra: '',
    realizadoPor: '',
    lugarRemision: {
      nombreInstitucion: '',
      direccion: '',
      contacto: '',
      costo: '',
      tecnicaUtilizada: ''
    },
    resultados: '',
    observaciones: '',
    adjuntos: []
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerMetodoComplementario = async () => {
      try {
        if (eventoId) {
          console.log('Intentando obtener método complementario con ID:', eventoId);
          setLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `${import.meta.env.VITE_API_USUARIO}examen-complementario/${eventoId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          const metodoData = response.data;
          
          let fechaFormateada = '';
          try {
            if (metodoData.fecha) {
              fechaFormateada = new Date(metodoData.fecha).toISOString().split('T')[0];
            }
          } catch (error) {
            console.error('Error al formatear la fecha:', error);
            fechaFormateada = '';
          }

          setMetodoComplementario({
            fecha: fechaFormateada,
            tipoExamen: metodoData.tipoExamen || '',
            metodo: metodoData.metodo || '',
            tomaMuestra: metodoData.tomaMuestra || '',
            realizadoPor: metodoData.realizadoPor || '',
            lugarRemision: {
              nombreInstitucion: metodoData.lugarRemision?.nombreInstitucion || '',
              direccion: metodoData.lugarRemision?.direccion || '',
              contacto: metodoData.lugarRemision?.contacto || '',
              costo: metodoData.lugarRemision?.costo || '',
              tecnicaUtilizada: metodoData.lugarRemision?.tecnicaUtilizada || ''
            },
            resultados: metodoData.resultados || '',
            observaciones: metodoData.observaciones || '',
            adjuntos: metodoData.adjuntos || []
          });
        }
      } catch (error) {
        console.error('Error al obtener método complementario:', error);
        Swal.fire('Error', 'No se pudo obtener el método complementario', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (show && eventoId) {
      obtenerMetodoComplementario();
    }
  }, [show, eventoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setMetodoComplementario(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setMetodoComplementario(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handleViewAdjunto = (url) => {
    window.open(url, '_blank');
  };

  const handleDeleteAdjunto = async (urlToDelete) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setMetodoComplementario(prev => ({
          ...prev,
          adjuntos: prev.adjuntos.filter(url => url !== urlToDelete)
        }));
      }
    } catch (error) {
      console.error('Error al eliminar adjunto:', error);
      Swal.fire('Error', 'No se pudo eliminar el adjunto', 'error');
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let adjuntos = [...metodoComplementario.adjuntos];
      if (selectedFiles.length > 0) {
        try {
          const uploadPromises = selectedFiles.map(file => uploadFileToCloudinary(file));
          const newAdjuntos = await Promise.all(uploadPromises);
          adjuntos = [...adjuntos, ...newAdjuntos];
        } catch (error) {
          console.error('Error al subir archivos:', error);
          Swal.fire('Error', 'No se pudieron subir los archivos', 'error');
          return;
        }
      }

      const token = localStorage.getItem('token');
      const metodoComplementarioData = {
        ...metodoComplementario,
        adjuntos,
        animalId,
        modificadoPor: user._id
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_USUARIO}examen-complementario/${eventoId}`,
        metodoComplementarioData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        onEventoActualizado(response.data);
        Swal.fire('Éxito', 'Método complementario actualizado correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error al actualizar método complementario:', error);
      Swal.fire('Error', 'No se pudo actualizar el método complementario', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Método Complementario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control 
                type="date"
                name="fecha"
                value={metodoComplementario.fecha}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Examen</Form.Label>
              <Form.Select
                name="tipoExamen"
                value={metodoComplementario.tipoExamen}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="Medicina Preventiva">Medicina Preventiva</option>
                <option value="Enfermedad">Enfermedad</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Metodo</Form.Label>
              <Form.Control 
                type="text"
                name="metodo"
                value={metodoComplementario.metodo}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Toma de Muestra</Form.Label>
              <Form.Control 
                type="text"
                name="tomaMuestra"
                value={metodoComplementario.tomaMuestra}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Realizado Por</Form.Label>
              <Form.Control 
                type="text"
                name="realizadoPor"
                value={metodoComplementario.realizadoPor}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lugar de Remisión</Form.Label>
              <Form.Control 
                type="text"
                name="lugarRemision.nombreInstitucion"
                value={metodoComplementario.lugarRemision.nombreInstitucion}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control 
                type="text"
                name="lugarRemision.direccion"
                value={metodoComplementario.lugarRemision.direccion}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contacto</Form.Label>
              <Form.Control 
                type="text"
                name="lugarRemision.contacto"
                value={metodoComplementario.lugarRemision.contacto}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Costo</Form.Label>
              <Form.Control 
                type="text"
                name="lugarRemision.costo"
                value={metodoComplementario.lugarRemision.costo}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Técnica Utilizada</Form.Label>
              <Form.Control 
                type="text"
                name="lugarRemision.tecnicaUtilizada"
                value={metodoComplementario.lugarRemision.tecnicaUtilizada}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Resultados</Form.Label>
              <Form.Control 
                type="text"
                name="resultados"
                value={metodoComplementario.resultados}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control 
                type="text"
                name="observaciones"
                value={metodoComplementario.observaciones}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adjuntos</Form.Label>
              {metodoComplementario.adjuntos.length > 0 && (
                <div className="mb-3">
                  {metodoComplementario.adjuntos.map((url, index) => (
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
              )}
              <Form.Control 
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,image/*"
              />
              <Form.Text className="text-muted">
                Puede seleccionar múltiples archivos PDF e imágenes
              </Form.Text>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button variant="primary" type="submit" disabled={uploading}>
                {uploading ? 'Actualizando...' : 'Actualizar Método Complementario'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditMetodoComplementarioModal;
