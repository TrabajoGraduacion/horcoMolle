import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddTratamientoModal = ({ show, handleClose, animalId, fichaClinicaId, user, onEventoCreado }) => {
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
      const fichaClinicaId = localStorage.getItem('fichaClinicaId');
      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró una ficha clínica activa', 'error');
        return;
      }

      let adjuntos = [];
      if (selectedFiles.length > 0) {
        try {
          const uploadPromises = selectedFiles.map(file => uploadFileToCloudinary(file));
          adjuntos = await Promise.all(uploadPromises);
        } catch (error) {
          console.error('Error al subir archivos:', error);
          Swal.fire('Error', 'No se pudieron subir los archivos', 'error');
          return;
        }
      }

      const token = localStorage.getItem('token');
      const tratamientoData = {
        ...tratamiento,
        fecha: new Date(tratamiento.fecha).toISOString(),
        adjuntos,
        animalId,
        fichaClinicaId,
        creadoPor: user._id
      };

      const tratamientoResponse = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}tratamiento`,
        tratamientoData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (tratamientoResponse.status === 201) {
        // Actualizar la ficha clínica con el ID del tratamiento
        await axios.put(
          `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`,
          { tratamientoId: tratamientoResponse.data.tratamientoId }
        );

        // Actualizar eventos en localStorage
        const eventosActuales = JSON.parse(localStorage.getItem('eventosCreados') || '[]');
        const nuevosEventos = [...eventosActuales, {
          tipo: 'Tratamiento',
          id: tratamientoResponse.data.tratamientoId,
          fecha: tratamientoResponse.data.fecha,
          datos: tratamientoResponse.data
        }];
        localStorage.setItem('eventosCreados', JSON.stringify(nuevosEventos));

        onEventoCreado(tratamientoResponse.data);
        
        // Limpiar el formulario
        setTratamiento({
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
        setSelectedFiles([]);

        Swal.fire('Éxito', 'Tratamiento guardado correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error al crear tratamiento:', error);
      Swal.fire('Error', 'No se pudo crear el tratamiento', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Tratamiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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

          {tratamiento.tipoTratamiento === 'Farmacológico' && (
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
            </>
          )}

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
              {uploading ? 'Guardando...' : 'Guardar Tratamiento'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTratamientoModal;