import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const EditObservacionDiariaModal = ({ show, handleClose, handleEdit, observacionToEdit }) => {
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
        archivosEnfoqueComportamental: [],
        archivosEnfoqueSalud: [],
        archivosEnfoqueAmbiental: []
      });
      const [animales, setAnimales] = useState([]);
      const [uploading, setUploading] = useState(false);
      const [selectedFiles, setSelectedFiles] = useState({
        comportamental: [],
        salud: [],
        ambiental: []
      });

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

  useEffect(() => {
    if (observacionToEdit) {
      const formattedDate = observacionToEdit.fechaObservacion 
        ? new Date(observacionToEdit.fechaObservacion).toISOString().split('T')[0]
        : '';
      
      setFormData(prevState => ({
        ...prevState,
        ...observacionToEdit,
        fechaObservacion: formattedDate,
        enfoqueComportamental: {
          ...prevState.enfoqueComportamental,
          ...observacionToEdit.enfoqueComportamental
        },
        enfoqueSalud: {
          ...prevState.enfoqueSalud,
          ...observacionToEdit.enfoqueSalud
        },
        enfoqueAmbiental: {
          ambienteExterno: {
            ...prevState.enfoqueAmbiental.ambienteExterno,
            ...observacionToEdit.enfoqueAmbiental?.ambienteExterno
          },
          ambienteInterno: {
            ...prevState.enfoqueAmbiental.ambienteInterno,
            ...observacionToEdit.enfoqueAmbiental?.ambienteInterno
          }
        }
      }));
    }
  }, [observacionToEdit]);

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
    const uploadPreset = 'unsigned_preset';
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
      let updatedFormData = { ...formData };

      // Solo subir nuevos archivos si se han seleccionado
      if (Object.values(selectedFiles).some(files => files.length > 0)) {
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

        // Combinar URLs existentes con nuevas URLs
        updatedFormData = {
          ...updatedFormData,
          archivosEnfoqueComportamental: [
            ...formData.archivosEnfoqueComportamental,
            ...uploadedUrls[0]
          ],
          archivosEnfoqueSalud: [
            ...formData.archivosEnfoqueSalud,
            ...uploadedUrls[1]
          ],
          archivosEnfoqueAmbiental: [
            ...formData.archivosEnfoqueAmbiental,
            ...uploadedUrls[2]
          ]
        };
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_USUARIO}observaciones-diarias/${formData._id}`, 
        updatedFormData
      );
      
      handleEdit(response.data);
      handleClose();
      Swal.fire('Éxito', 'Observación diaria actualizada correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar la observación diaria:', error);
      Swal.fire('Error', 'No se pudo actualizar la observación diaria', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Observación Diaria</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Animal</Form.Label>
            <Form.Select name="animalId" onChange={handleChange} value={formData.animalId} required>
              <option value="">Seleccione un animal</option>
              {animales.map(animal => (
                <option key={animal._id} value={animal._id}>{animal.nombreInstitucional}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Observación</Form.Label>
            <Form.Control 
              type="date" 
              name="fechaObservacion" 
              onChange={handleChange} 
              value={formData.fechaObservacion} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            <Form.Control type="time" name="hora" onChange={handleChange} value={formData.hora} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duración</Form.Label>
            <Form.Control type="text" name="duracion" onChange={handleChange} value={formData.duracion} placeholder="HH:MM" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contexto Ambiental</Form.Label>
            <Form.Control as="textarea" name="contextoAmbiental" onChange={handleChange} value={formData.contextoAmbiental} required />
          </Form.Group>
          
          {/* Enfoque Comportamental y sus archivos */}
          <h5>Enfoque Comportamental</h5>
          <Form.Group className="mb-3">
            <Form.Label>Actividad</Form.Label>
            <Form.Control type="text" name="actividad" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} value={formData.enfoqueComportamental?.actividad || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Social</Form.Label>
            <Form.Control type="text" name="social" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} value={formData.enfoqueComportamental?.social || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comportamental</Form.Label>
            <Form.Control type="text" name="comportamental" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} value={formData.enfoqueComportamental?.comportamental || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nutrición</Form.Label>
            <Form.Control type="text" name="nutricion" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} value={formData.enfoqueComportamental?.nutricion || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Manejo</Form.Label>
            <Form.Control type="text" name="manejo" onChange={(e) => handleNestedChange(e, 'enfoqueComportamental')} value={formData.enfoqueComportamental?.manejo || ''} />
          </Form.Group>

          {/* Archivos del Enfoque Comportamental */}
          <Form.Group className="mb-4">
            <Form.Label>Archivos del Enfoque Comportamental</Form.Label>
            {formData.archivosEnfoqueComportamental?.length > 0 && (
              <div className="mb-2">
                {formData.archivosEnfoqueComportamental.map((url, index) => (
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
                      onClick={() => {
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
                              archivosEnfoqueComportamental: prev.archivosEnfoqueComportamental.filter((_, i) => i !== index)
                            }));
                            Swal.fire('Eliminado', 'El archivo ha sido eliminado.', 'success');
                          }
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Form.Control
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, 'comportamental')}
              accept=".pdf,image/*"
              className="mt-2"
            />
          </Form.Group>

          {/* Enfoque Salud y sus archivos */}
          <h5>Enfoque Salud</h5>
          <Form.Group className="mb-3">
            <Form.Label>Condición Física</Form.Label>
            <Form.Control type="text" name="condicionFisica" onChange={(e) => handleNestedChange(e, 'enfoqueSalud')} value={formData.enfoqueSalud?.condicionFisica || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Discapacidad</Form.Label>
            <Form.Control type="text" name="discapacidad" onChange={(e) => handleNestedChange(e, 'enfoqueSalud')} value={formData.enfoqueSalud?.discapacidad || ''} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Condición General</Form.Label>
            <Form.Control type="text" name="condicionGeneral" onChange={(e) => handleNestedChange(e, 'enfoqueSalud')} value={formData.enfoqueSalud?.condicionGeneral || ''} />
          </Form.Group>

          {/* Archivos del Enfoque Salud */}
          <Form.Group className="mb-4">
            <Form.Label>Archivos del Enfoque Salud</Form.Label>
            {formData.archivosEnfoqueSalud?.length > 0 && (
              <div className="mb-2">
                {formData.archivosEnfoqueSalud.map((url, index) => (
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
                      onClick={() => {
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
                              archivosEnfoqueSalud: prev.archivosEnfoqueSalud.filter((_, i) => i !== index)
                            }));
                            Swal.fire('Eliminado', 'El archivo ha sido eliminado.', 'success');
                          }
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Form.Control
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, 'salud')}
              accept=".pdf,image/*"
              className="mt-2"
            />
          </Form.Group>

          {/* Enfoque Ambiental y sus archivos */}
          <h5>Enfoque Ambiental</h5>
          <h6>Ambiente Externo</h6>
          <Form.Group className="mb-3">
            <Form.Label>Tiempo de Permanencia</Form.Label>
            <Form.Control type="text" name="tiempoPermanencia" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteExterno')} value={formData.enfoqueAmbiental?.ambienteExterno?.tiempoPermanencia} placeholder="HH:MM" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Higiene</Form.Label>
            <Form.Control type="text" name="higiene" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteExterno')} value={formData.enfoqueAmbiental?.ambienteExterno?.higiene} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Seguridad</Form.Label>
            <Form.Control type="text" name="seguridad" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteExterno')} value={formData.enfoqueAmbiental?.ambienteExterno?.seguridad} />
          </Form.Group>

          <h6>Ambiente Interno</h6>
          <Form.Group className="mb-3">
            <Form.Label>Tiempo de Permanencia</Form.Label>
            <Form.Control type="text" name="tiempoPermanencia" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} value={formData.enfoqueAmbiental?.ambienteInterno?.tiempoPermanencia} placeholder="HH:MM" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Higiene</Form.Label>
            <Form.Control type="text" name="higiene" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} value={formData.enfoqueAmbiental?.ambienteInterno?.higiene} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Seguridad</Form.Label>
            <Form.Control type="text" name="seguridad" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} value={formData.enfoqueAmbiental?.ambienteInterno?.seguridad} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bioseguridad Manejador</Form.Label>
            <Form.Control type="text" name="bioseguridadManejador" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} value={formData.enfoqueAmbiental?.ambienteInterno?.bioseguridadManejador} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bioseguridad Animal</Form.Label>
            <Form.Control type="text" name="bioseguridadAnimal" onChange={(e) => handleNestedChange(e, 'enfoqueAmbiental', 'ambienteInterno')} value={formData.enfoqueAmbiental?.ambienteInterno?.bioseguridadAnimal} />
          </Form.Group>

          {/* Archivos del Enfoque Ambiental */}
          <Form.Group className="mb-4">
            <Form.Label>Archivos del Enfoque Ambiental</Form.Label>
            {formData.archivosEnfoqueAmbiental?.length > 0 && (
              <div className="mb-2">
                {formData.archivosEnfoqueAmbiental.map((url, index) => (
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
                      onClick={() => {
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
                              archivosEnfoqueAmbiental: prev.archivosEnfoqueAmbiental.filter((_, i) => i !== index)
                            }));
                            Swal.fire('Eliminado', 'El archivo ha sido eliminado.', 'success');
                          }
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Form.Control
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, 'ambiental')}
              accept=".pdf,image/*"
              className="mt-2"
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading ? 'Guardando...' : 'Actualizar Observación Diaria'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditObservacionDiariaModal;