import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Image } from 'react-bootstrap';
import axios from 'axios';

const ViewModificacionModal = ({ show, onHide, modificacionId }) => {
  const [modificacion, setModificacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModificacionModal, setShowModificacionModal] = useState(show);

  useEffect(() => {
    setShowModificacionModal(show);
  }, [show]);

  useEffect(() => {
    if (showModificacionModal && modificacionId) {
      fetchModificacion();
    }
  }, [showModificacionModal, modificacionId]);

  const fetchModificacion = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}modificacion-recinto/${modificacionId}`);
      setModificacion(response.data);
    } catch (error) {
      console.error('Error al obtener la modificación:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', { timeZone: 'UTC' });
  };

  const formatFieldName = (fieldName) => {
    return fieldName.split('.').map(part => {
      if (part.startsWith('ambientesExternos[') || part.startsWith('ambientesInternos[')) {
        part = part.replace('[', ' [');
      }
      return part.split(/(?=[A-Z])/)
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ');
    }).join(' - ');
  };

  const renderValue = (campo, valor) => {
    if (campo.toLowerCase().includes('fotos')) {
      const fotos = Array.isArray(valor) ? valor : [valor];
      return (
        <div className="d-flex flex-wrap justify-content-center">
          {fotos.map((foto, index) => (
            <Image 
              key={index}
              src={foto} 
              thumbnail 
              style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer', objectFit: 'cover' }} 
              onClick={() => {
                setSelectedImage(foto);
                setShowModificacionModal(false);
              }}
            />
          ))}
        </div>
      );
    } else if (typeof valor === 'object' && valor !== null) {
      return JSON.stringify(valor, null, 2);
    }
    return String(valor);
  };

  const handleCloseImagePreview = () => {
    setSelectedImage(null);
    setShowModificacionModal(true);
  };

  if (loading) {
    return (
      <Modal show={showModificacionModal} onHide={onHide} size="lg">
        <Modal.Body>Cargando...</Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <Modal show={showModificacionModal} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ver Modificación del Recinto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!modificacion ? (
            <p>No hay modificación registrada.</p>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Campo Modificado</th>
                    <th>Nuevo Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {modificacion.camposModificados.map((campo, index) => (
                    <tr key={index}>
                      <td>{formatFieldName(campo.campo)}</td>
                      <td>{renderValue(campo.campo, campo.nuevoValor)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p className="text-end text-muted mt-2">
                Fecha de modificación: {formatDate(modificacion.creadoEn)}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!selectedImage} onHide={handleCloseImagePreview} size="lg" centered>
        <Modal.Body className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <Image src={selectedImage || ''} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewModificacionModal;
