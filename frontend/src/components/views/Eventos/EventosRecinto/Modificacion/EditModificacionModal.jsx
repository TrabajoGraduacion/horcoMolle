import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { AuthContext } from '../../../../../../context/AuthContext';

const EditModificacionModal = ({ show, onHide, eventId, onSubmit }) => {
  const { user } = useContext(AuthContext);
  const [modificacion, setModificacion] = useState({
    recintoId: '',
    camposModificados: [
      {
        campo: '',
        nuevoValor: ''
      }
    ],
    observaciones: '',
    realizadoPor: user ? user._id : '',
  });

  const [recintos, setRecintos] = useState([]);
  const [selectedRecinto, setSelectedRecinto] = useState(null);

  useEffect(() => {
    const fetchRecintos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}recintos`);
        setRecintos(response.data.map(recinto => ({
          value: recinto._id,
          label: recinto.nombre
        })));
      } catch (error) {
        console.error('Error al obtener los recintos:', error);
      }
    };

    fetchRecintos();
  }, []);

  useEffect(() => {
    const fetchModificacion = async () => {
      if (eventId) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}modificacion-recinto/${eventId}`);
          const data = response.data;
          
          const recintoEncontrado = recintos.find(recinto => recinto.value === data.recintoId);
          
          setModificacion({
            recintoId: data.recintoId,
            camposModificados: data.camposModificados,
            observaciones: data.observaciones,
            realizadoPor: data.realizadoPor
          });

          setSelectedRecinto(recintoEncontrado || {
            value: data.recintoId,
            label: data.nombreRecinto || 'Recinto no encontrado'
          });
        } catch (error) {
          console.error('Error al obtener la modificación:', error);
          Swal.fire('Error', 'No se pudo cargar la modificación', 'error');
        }
      }
    };

    if (show && eventId && recintos.length > 0) {
      fetchModificacion();
    }
  }, [show, eventId, recintos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModificacion(prev => ({ ...prev, [name]: value }));
  };

  const handleRecintoChange = (selectedOption) => {
    setSelectedRecinto(selectedOption);
    setModificacion(prev => ({ ...prev, recintoId: selectedOption.value }));
  };

  const handleCampoModificadoChange = (index, field, value) => {
    const newCamposModificados = [...modificacion.camposModificados];
    newCamposModificados[index] = {
      ...newCamposModificados[index],
      [field]: value
    };
    setModificacion(prev => ({
      ...prev,
      camposModificados: newCamposModificados
    }));
  };

  const addCampoModificado = () => {
    setModificacion(prev => ({
      ...prev,
      camposModificados: [...prev.camposModificados, { campo: '', nuevoValor: '' }]
    }));
  };

  const removeCampoModificado = (index) => {
    setModificacion(prev => ({
      ...prev,
      camposModificados: prev.camposModificados.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_USUARIO}modificacion-recinto/${eventId}`,
        modificacion
      );
      
      if (response.status === 200) {
        Swal.fire('¡Éxito!', 'Modificación actualizada con éxito', 'success');
        onSubmit(response.data);
        onHide();
      }
    } catch (error) {
      console.error('Error al actualizar la modificación:', error);
      Swal.fire('Error', `No se pudo actualizar la modificación: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Modificación de Recinto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Recinto</Form.Label>
            <Select
              value={selectedRecinto}
              options={recintos}
              onChange={handleRecintoChange}
              placeholder="Seleccione un recinto"
              required
            />
          </Form.Group>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label>Campos Modificados</Form.Label>
              <Button 
                variant="success" 
                size="sm" 
                onClick={addCampoModificado}
                style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}
              >
                + Agregar Campo
              </Button>
            </div>
            
            {modificacion.camposModificados.map((campo, index) => (
              <div key={index} className="border p-3 mb-2 rounded">
                <div className="d-flex justify-content-between mb-2">
                  <h6>Campo {index + 1}</h6>
                  {index > 0 && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => removeCampoModificado(index)}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre del Campo</Form.Label>
                  <Form.Control
                    type="text"
                    value={campo.campo}
                    onChange={(e) => handleCampoModificadoChange(index, 'campo', e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Nuevo Valor</Form.Label>
                  <Form.Control
                    type="text"
                    value={campo.nuevoValor}
                    onChange={(e) => handleCampoModificadoChange(index, 'nuevoValor', e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            ))}
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observaciones"
              value={modificacion.observaciones}
              onChange={handleChange}
            />
          </Form.Group>

          <Button 
            variant="success" 
            type="submit"
            style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}
          >
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditModificacionModal;
