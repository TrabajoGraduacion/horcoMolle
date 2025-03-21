import React, { useState } from 'react';
import { Modal, Button, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const CreateUserModal = ({ onUpdate, show }) => {
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    repeatPassword: '',
    rol: 'Docente' // Valor por defecto
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Maneja cambios en los campos de entrada del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Alterna la visibilidad de la contraseña
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Alterna la visibilidad de la repetición de la contraseña
  const toggleShowRepeatPassword = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  // Maneja el cambio de rol del usuario
  const handleRoleChange = (value) => {
    setNewUser({ ...newUser, rol: value });
  };

  // Maneja la acción de presionar la tecla 'Enter' en el formulario
  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveChanges();
    }
  };

  // Guarda los cambios y crea un nuevo usuario
  const handleSaveChanges = async () => {
    // Validar que las contraseñas coincidan
    if (newUser.contrasena !== newUser.repeatPassword) {
      return Swal.fire({
        title: 'Las contraseñas no coinciden',
        text: 'Por favor, verifique que ambas contraseñas sean iguales',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#70AA68'
      });
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_USUARIO}register`, newUser);
      if (response.status === 201) {
        handleClose();
        Swal.fire({
          title: "¡Usuario creado exitosamente!",
          text: "El nuevo usuario ha sido registrado en el sistema",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#70AA68',
          allowEnterKey: true,
          customClass: {
            confirmButton: 'custom-swal-button'
          }
        }).then(() => {
          onUpdate();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "Entendido",
          confirmButtonColor: '#70AA68'
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error en el registro",
        text: error.response?.data?.message || "Hubo un problema al crear el usuario. Por favor, inténtelo nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: '#70AA68'
      });
    }
  };

  // Cierra el modal y restablece el formulario
  const handleClose = () => {
    setNewUser({
      nombre: '',
      apellido: '',
      correo: '',
      contrasena: '',
      repeatPassword: '',
      rol: 'Docente' // Valor por defecto
    });
    setShowPassword(false);
    setShowRepeatPassword(false);
    onUpdate();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Añadir Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex flex-column gap-3" onKeyDown={handleFormKeyDown}>
          <Form.Group controlId="formNewNombre">
            <Form.Label className="fw-bold">Nombre</Form.Label>
            <Form.Control
              className="border-1 border-secondary"
              type="text"
              name="nombre"
              placeholder="Ingrese el nombre"
              value={newUser.nombre}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formNewApellido">
            <Form.Label className="fw-bold">Apellido</Form.Label>
            <Form.Control
              className="border-1 border-secondary"
              type="text"
              name="apellido"
              placeholder="Ingrese el apellido"
              value={newUser.apellido}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formNewCorreo">
            <Form.Label className="fw-bold">Correo</Form.Label>
            <Form.Control
              className="border-1 border-secondary"
              type="email"
              name="correo"
              placeholder="Ingrese el correo electrónico"
              value={newUser.correo}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formNewPassword">
            <Form.Label className="fw-bold">Contraseña</Form.Label>
            <div className="password-input-container">
              <Form.Control
                className="border-1 border-secondary"
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                name="contrasena"
                value={newUser.contrasena}
                onChange={handleInputChange}
              />
              <Form.Check
                className="border-1 border-secondary mt-2"
                type="checkbox"
                label="Mostrar contraseña"
                onChange={toggleShowPassword}
              />
            </div>
            <Form.Text id="passwordHelpBlock" muted>
              La contraseña debe tener 8 caracteres o más.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formRepeatPassword">
            <Form.Label className="fw-bold">Repetir Contraseña</Form.Label>
            <div className="password-input-container">
              <Form.Control
                className="border-1 border-secondary"
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repita su contraseña"
                name="repeatPassword"
                value={newUser.repeatPassword}
                onChange={handleInputChange}
              />
              <Form.Check
                className="border-1 border-secondary mt-2"
                type="checkbox"
                label="Mostrar repetir contraseña"
                onChange={toggleShowRepeatPassword}
              />
            </div>
          </Form.Group>
          <Form.Group controlId="formNewRole">
            <Form.Label className="fw-bold d-block">Rol</Form.Label>
            <ToggleButtonGroup
              type="radio"
              name="rol"
              value={newUser.rol}
              onChange={handleRoleChange}
              className="d-flex justify-content-between"
            >
              <ToggleButton
                variant="outline-success"
                className="flex-fill me-1"
                id="radio-1"
                value="Administrador"
                style={{
                  transition: 'all 0.3s ease',
                  backgroundColor: newUser.rol === 'Administrador' ? '#70AA68' : 'white',
                  color: newUser.rol === 'Administrador' ? 'white' : '#70AA68',
                  borderColor: '#70AA68'
                }}
                onMouseEnter={(e) => {
                  if (newUser.rol !== 'Administrador') {
                    e.currentTarget.style.backgroundColor = '#e8f5e9';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (newUser.rol !== 'Administrador') {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                Administrador
              </ToggleButton>
              <ToggleButton
                variant="outline-success"
                className="flex-fill me-1"
                id="radio-2"
                value="Guardafauna"
                style={{
                  transition: 'all 0.3s ease',
                  backgroundColor: newUser.rol === 'Guardafauna' ? '#70AA68' : 'white',
                  color: newUser.rol === 'Guardafauna' ? 'white' : '#70AA68',
                  borderColor: '#70AA68'
                }}
                onMouseEnter={(e) => {
                  if (newUser.rol !== 'Guardafauna') {
                    e.currentTarget.style.backgroundColor = '#e8f5e9';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (newUser.rol !== 'Guardafauna') {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                Guardafauna
              </ToggleButton>
              <ToggleButton
                variant="outline-success"
                className="flex-fill"
                id="radio-3"
                value="Docente"
                style={{
                  transition: 'all 0.3s ease',
                  backgroundColor: newUser.rol === 'Docente' ? '#70AA68' : 'white',
                  color: newUser.rol === 'Docente' ? 'white' : '#70AA68',
                  borderColor: '#70AA68'
                }}
                onMouseEnter={(e) => {
                  if (newUser.rol !== 'Docente') {
                    e.currentTarget.style.backgroundColor = '#e8f5e9';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (newUser.rol !== 'Docente') {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                Docente
              </ToggleButton>
            </ToggleButtonGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button 
          variant="danger" 
          onClick={handleClose}
          style={{
            backgroundColor: 'white',
            borderColor: '#FF0000',
            color: '#FF0000',
            width: '120px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FF0000';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#FF0000';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Cancelar
        </Button>
        <Button 
          variant="success" 
          onClick={handleSaveChanges}
          style={{
            backgroundColor: '#70AA68',
            borderColor: '#70AA68',
            width: '120px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5C8F55';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#70AA68';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateUserModal;
