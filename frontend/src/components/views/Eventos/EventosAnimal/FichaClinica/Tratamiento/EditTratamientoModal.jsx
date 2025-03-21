import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const EditTratamientoModal = ({ show, handleClose, eventoId, animalId, user, onEventoActualizado }) => {
  const [tratamiento, setTratamiento] = useState({
    fecha: '',
    tipoTratamiento: '',
    detalleNoFarmacologico: '',
    farmaco: {
      nombreComercial: '',
      nombreDroga: '',
      concentration: ''
    },
    dosis: {
      dosisEspecie: '',
      dosisPractica: '',
      viaAdministracion: '',
      frecuencia: '',
      tiempoTratamiento: '',
      exitoAdministracion: ''
    },
    responsable: '',
    observaciones: '',
    adjuntos: []
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTratamiento = async () => {
      try {
        if (eventoId) {
          setLoading(true);
          const response = await axios.get(
            `${import.meta.env.VITE_API_USUARIO}tratamiento/${eventoId}`
          );
          
          const tratamientoData = response.data;
          setTratamiento({
            ...tratamientoData,
            fecha: new Date(tratamientoData.fecha).toISOString().split('T')[0],
            farmaco: tratamientoData.farmaco || {
              nombreComercial: '',
              nombreDroga: '',
              concentration: ''
            },
            dosis: tratamientoData.dosis || {
              dosisEspecie: '',
              dosisPractica: '',
              viaAdministracion: '',
              frecuencia: '',
              tiempoTratamiento: '',
              exitoAdministracion: ''
            },
            adjuntos: tratamientoData.adjuntos || []
          });
        }
      } catch (error) {
        console.error('Error al obtener tratamiento:', error);
        Swal.fire('Error', 'No se pudo obtener el tratamiento', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (show && eventoId) {
      obtenerTratamiento();
    }
  }, [show, eventoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setTratamiento(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setTratamiento(prev => ({
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
        setTratamiento(prev => ({
          ...prev,
          adjuntos: prev.adjuntos.filter(url => url !== urlToDelete)
        }));
      }
    });
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
      let nuevasUrls = [];
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => uploadFileToCloudinary(file));
        nuevasUrls = await Promise.all(uploadPromises);
      }

      const todasLasUrls = [...tratamiento.adjuntos, ...nuevasUrls];

      const tratamientoData = {
        ...tratamiento,
        fecha: new Date(tratamiento.fecha).toISOString(),
        adjuntos: todasLasUrls,
        animalId: animalId,
        creadoPor: user._id
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_USUARIO}tratamiento/${eventoId}`,
        tratamientoData
      );

      if (response.status === 200) {
        onEventoActualizado(response.data);
        Swal.fire('Éxito', 'Tratamiento actualizado correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error al actualizar tratamiento:', error);
      Swal.fire('Error', 'No se pudo actualizar el tratamiento', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Tratamiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!loading && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control 
                type="date" 
                name="fecha"
                value={tratamiento.fecha}
                onChange={handleInputChange}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Tratamiento</Form.Label>
              <Form.Select
                name="tipoTratamiento"
                value={tratamiento.tipoTratamiento}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="Farmacológico">Farmacológico</option>
                <option value="No farmacológico">No farmacológico</option>
              </Form.Select>
            </Form.Group>

            {tratamiento.tipoTratamiento === 'No farmacológico' ? (
              <Form.Group className="mb-3">
                <Form.Label>Detalle del Tratamiento No Farmacológico</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={3}
                  name="detalleNoFarmacologico"
                  value={tratamiento.detalleNoFarmacologico}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Comercial</Form.Label>
                  <Form.Control 
                    type="text"
                    name="farmaco.nombreComercial"
                    value={tratamiento.farmaco.nombreComercial}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre Droga</Form.Label>
                  <Form.Control 
                    type="text"
                    name="farmaco.nombreDroga"
                    value={tratamiento.farmaco.nombreDroga}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Concentración</Form.Label>
                  <Form.Control 
                    type="text"
                    name="farmaco.concentration"
                    value={tratamiento.farmaco.concentration}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dosis por Especie</Form.Label>
                  <Form.Control 
                    type="text"
                    name="dosis.dosisEspecie"
                    value={tratamiento.dosis.dosisEspecie}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dosis Práctica</Form.Label>
                  <Form.Control 
                    type="text"
                    name="dosis.dosisPractica"
                    value={tratamiento.dosis.dosisPractica}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Vía de Administración</Form.Label>
                  <Form.Control 
                    type="text"
                    name="dosis.viaAdministracion"
                    value={tratamiento.dosis.viaAdministracion}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Frecuencia</Form.Label>
                  <Form.Control 
                    type="text"
                    name="dosis.frecuencia"
                    value={tratamiento.dosis.frecuencia}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tiempo de Tratamiento</Form.Label>
                  <Form.Control 
                    type="text"
                    name="dosis.tiempoTratamiento"
                    value={tratamiento.dosis.tiempoTratamiento}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Éxito de Administración</Form.Label>
                  <Form.Control 
                    type="text"
                    name="dosis.exitoAdministracion"
                    value={tratamiento.dosis.exitoAdministracion}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Responsable</Form.Label>
              <Form.Control 
                type="text"
                name="responsable"
                value={tratamiento.responsable}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                name="observaciones"
                value={tratamiento.observaciones}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adjuntos (PDF o Imágenes)</Form.Label>
              {tratamiento.adjuntos && tratamiento.adjuntos.length > 0 && (
                <div>
                  {tratamiento.adjuntos.map((url, index) => (
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
                Puede seleccionar múltiples archivos PDF o imágenes
              </Form.Text>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button variant="primary" type="submit" disabled={uploading}>
                {uploading ? 'Actualizando...' : 'Actualizar Tratamiento'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditTratamientoModal;
