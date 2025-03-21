import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddMetodoComplementarioModal = ({ show, handleClose, animalId, fichaClinicaId, user, onEventoCreado }) => {
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
      const metodoComplementarioData = {
        ...metodoComplementario,
        fecha: new Date(metodoComplementario.fecha).toISOString(),
        adjuntos,
        animalId,
        fichaClinicaId,
        creadoPor: user._id
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}examen-complementario`,
        metodoComplementarioData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        // Actualizar la ficha clínica con el ID del método complementario
        await axios.put(
          `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`,
          { metodoComplementarioId: response.data.examenComplementarioId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        Swal.fire('Éxito', 'Método complementario guardado correctamente', 'success');
        onEventoCreado(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error al crear método complementario:', error);
      Swal.fire('Error', 'No se pudo crear el método complementario', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Método Complementario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            <Form.Label>Método</Form.Label>
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

          <h5>Lugar de Remisión</h5>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Institución</Form.Label>
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
              type="number"
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
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Resultados</Form.Label>
            <Form.Control 
              as="textarea"
              rows={3}
              name="resultados"
              value={metodoComplementario.resultados}
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
              value={metodoComplementario.observaciones}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adjuntos</Form.Label>
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
              {uploading ? 'Guardando...' : 'Guardar Método Complementario'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddMetodoComplementarioModal;