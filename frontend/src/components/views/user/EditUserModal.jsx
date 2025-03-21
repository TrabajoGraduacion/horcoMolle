import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const EditUserModal = ({ user, onUpdate }) => {
  const [editedUser, setEditedUser] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    repeatPassword: '',
    rol: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedUser({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo: user.correo || '',
        contrasena: '',
        repeatPassword: '',
        rol: user.rol || 'Docente'
      });
    }
  }, [user]);

  const handleRoleChange = (value) => {
    setEditedUser({ ...editedUser, rol: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      let updatedUser = { ...editedUser };

      if (!changePassword) {
        delete updatedUser.contrasena;
        delete updatedUser.repeatPassword;
      }

      if (changePassword && editedUser.contrasena !== editedUser.repeatPassword) {
        return Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
      }

      const response = await axios.put(`${import.meta.env.VITE_API_USUARIO}usuarios/${user._id}`, updatedUser);
      if (response.status === 200) {
        Swal.fire({
          title: 'Usuario actualizado',
          text: 'Los datos del usuario han sido actualizados correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          handleClose();
          onUpdate();
        });
      } else {
        Swal.fire('Error', 'Hubo un problema al actualizar el usuario.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.mensaje || 'Hubo un problema en el servidor.', 'error');
    }
  };

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveChanges();
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowRepeatPassword = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const toggleChangePassword = () => {
    setChangePassword(!changePassword);
  };

  const handleClose = () => {
    setChangePassword(false);
    setShowRepeatPassword(false);
    setShowPassword(false);
    onUpdate();
  };

  return (
    <Modal show={Boolean(user)} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex flex-column gap-3" onKeyDown={handleFormKeyDown}>
          <Form.Group controlId="formNombre">
            <Form.Label className="fw-bold">Nombre</Form.Label>
            <Form.Control
              className="border-1 border-secondary"
              type="text"
              name="nombre"
              placeholder="Ingrese el nombre"
              value={editedUser.nombre || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formApellido">
            <Form.Label className="fw-bold">Apellido</Form.Label>
            <Form.Control
              className="border-1 border-secondary"
              type="text"
              name="apellido"
              placeholder="Ingrese el apellido"
              value={editedUser.apellido || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formCorreo">
            <Form.Label className="fw-bold">Correo</Form.Label>
            <Form.Control
              className="border-1 border-secondary"
              type="email"
              name="correo"
              placeholder="Ingrese el correo electrónico"
              value={editedUser.correo || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="my-1">
            <Form.Check
              className="border-1 border-secondary"
              type="checkbox"
              label="¿Desea cambiar la contraseña?"
              onChange={toggleChangePassword}
            />
          </Form.Group>
          <Form.Group controlId="formContrasena">
            <Form.Label className={`fw-bold ${changePassword ? '' : 'text-muted'}`}>Contraseña Nueva</Form.Label>
            <div className="password-input-container">
              <Form.Control
                className="border-1 border-secondary"
                disabled={!changePassword}
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingrese la nueva contraseña"
                name="contrasena"
                value={editedUser.contrasena || ''}
                onChange={handleInputChange}
              />
              <Form.Check
                className="border-1 border-secondary mt-2"
                disabled={!changePassword}
                type="checkbox"
                label="Mostrar contraseña nueva"
                onChange={toggleShowPassword}
              />
            </div>
          </Form.Group>
          <Form.Group controlId="formRepeatPassword">
            <Form.Label className={`fw-bold ${changePassword ? '' : 'text-muted'}`}>Repita la Contraseña</Form.Label>
            <div className="password-input-container">
              <Form.Control
                className="border-1 border-secondary"
                disabled={!changePassword}
                type={showRepeatPassword ? 'text' : 'password'}
                placeholder="Repita la nueva contraseña"
                name="repeatPassword"
                value={editedUser.repeatPassword || ''}
                onChange={handleInputChange}
              />
              <Form.Check
                className="border-1 border-secondary mt-2"
                disabled={!changePassword}
                type="checkbox"
                label="Mostrar repetir contraseña"
                onChange={toggleShowRepeatPassword}
              />
            </div>
          </Form.Group>
          <Form.Group controlId="formRole">
            <Form.Label className="fw-bold d-block">Rol</Form.Label>
            <ToggleButtonGroup
              type="radio"
              name="rol"
              value={editedUser.rol}
              onChange={handleRoleChange}
              className="d-flex justify-content-between"
            >
              <ToggleButton variant="outline-success" className="flex-fill me-1" id="radio-1" value="Administrador">
                Administrador
              </ToggleButton>
              <ToggleButton variant="outline-success" className="flex-fill me-1" id="radio-2" value="Guardafauna">
                Guardafauna
              </ToggleButton>
              <ToggleButton variant="outline-success" className="flex-fill" id="radio-3" value="Docente">
                Docente
              </ToggleButton>
            </ToggleButtonGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="success" onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
