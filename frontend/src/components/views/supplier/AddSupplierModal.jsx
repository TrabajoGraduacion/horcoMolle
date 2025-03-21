import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../../styles/supplier.css';

const AddSupplierModal = ({ show, handleClose, handleAdd }) => {
  const [newSupplierData, setNewSupplierData] = useState({
    name: '',
    mail: '',
    phone: '',
    address: '',
    contact: '',
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupplierData({ ...newSupplierData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const supplierData = {
      name: newSupplierData.name,
      mail: newSupplierData.mail || undefined,
      phone: newSupplierData.phone || undefined,
      address: newSupplierData.address || undefined,
      contact: newSupplierData.contact || undefined,
      isActive: newSupplierData.isActive,
    };
    handleAdd(supplierData);
    setNewSupplierData({
      name: '',
      mail: '',
      phone: '',
      address: '',
      contact: '',
      isActive: true,
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Nombre de la empresa (*)</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newSupplierData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="mail"
              value={newSupplierData.mail}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={newSupplierData.phone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={newSupplierData.address}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formContact">
            <Form.Label>Nombre del contacto</Form.Label>
            <Form.Control
              type="text"
              name="contact"
              value={newSupplierData.contact}
              onChange={handleChange}
            />
          </Form.Group>
          <Button className="custom-button mt-3" variant="primary" type="submit">
            Agregar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddSupplierModal;
