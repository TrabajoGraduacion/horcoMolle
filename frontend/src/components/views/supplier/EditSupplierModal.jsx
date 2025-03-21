import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';


const EditSupplierModal = ({ supplier, onUpdate }) => {
  const [editedSupplier, setEditedSupplier] = useState({ 
    name: '',
    contact: '',
    mail: ''
  });

  useEffect(() => {
    if (supplier) {
      setEditedSupplier({ 
        name: supplier.name || '',
        contact: supplier.contact || '',
        mail: supplier.mail || ''
      });
    }
  }, [supplier]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSupplier({ ...editedSupplier, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_USUARIO}suppliers/${supplier._id}`, editedSupplier);

      console.log(editedSupplier)

      if (response.status === 200) {
        onUpdate();
        Swal.fire({
          title: "Proveedor actualizado",
          text: "Los cambios se guardaron correctamente",
          icon: "success",
          confirmButtonText: "OK",
          allowEnterKey: true  
        }).then(() => {
          onUpdate(); 
        });
      } else {
        Swal.fire(
          "Error",
          "No se pudieron guardar los cambios",
          "error"
        );
      }
    } catch (error) {
      console.log(error.message);
      Swal.fire(
        "Error",
        "Hubo un error al procesar la solicitud",
        "error"
      );
    }
  };

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveChanges();
    }
  };

  return (
    <Modal show={Boolean(supplier)} onHide={onUpdate}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onKeyDown={handleFormKeyDown}>
          <Form.Group controlId="formName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="name" value={editedSupplier.name || ''} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formContact">
            <Form.Label>Contacto</Form.Label>
            <Form.Control type="text" name="contact" value={editedSupplier.contact || ''} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formmail">
            <Form.Label>mail</Form.Label>
            <Form.Control type="String" name="mail" value={editedSupplier.mail || ''} onChange={handleInputChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onUpdate}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSupplierModal;
