import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Table, Dropdown } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../styles/administrador.css';
import { Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import EditUserModal from './EditUserModal';
import CreateUserModal from './CreateUserModal';
import logomerc from '/src/assets/logoMerc.png';

const Administrador = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    rol: '',
  });
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}usuarios`); // Cambio de 'users' a 'usuarios'
      console.log('API Response:', response.data);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
        console.log('Users set:', response.data);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setError('La estructura de la respuesta de la API no es la esperada.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar los usuarios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowCreateUserModal(false);
  const handleShow = () => setShowCreateUserModal(true);

  const editUser = (user) => {
    setSelectedUser(user);
  };

  const changeUserStatus = async (user) => {
    try {
      const endpoint = user.activo ? 'dar-de-baja' : 'dar-de-alta'; // Cambia 'deactivate' a 'dar-de-baja' y 'activate' a 'dar-de-alta'
      const response = await axios.patch(`${import.meta.env.VITE_API_USUARIO}usuarios/${user._id}/${endpoint}`, {}); // Actualiza la ruta
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
      return { status: 500, error: 'Error del servidor' };
    }
  };

  const confirmChangeUserStatus = (user) => {
    const action = user.activo ? 'desactivar' : 'activar';
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres ${action} este usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ' + action,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        changeUserStatus(user).then(response => {
          if (response.status === 200) {
            Swal.fire(
              '¡Completado!',
              `El usuario ha sido ${action}do.`,
              'success'
            );
            getUsers();
          } else {
            Swal.fire(
              'Error',
              'Hubo un problema al cambiar el estado del usuario.',
              'error'
            );
          }
        });
      }
    });
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_USUARIO}usuarios/${id}`); // Cambio de 'users' a 'usuarios'
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
      return { status: 500, error: 'Error del servidor' };
    }
  };

  const confirmDeleteUser = (user) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(user._id).then(response => {
          if (response.status === 200) {
            Swal.fire(
              '¡Eliminado!',
              'El usuario ha sido eliminado.',
              'success'
            );
            getUsers();
          } else {
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el usuario.',
              'error'
            );
          }
        });
      }
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      return (
        (!filters.nombre || user.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) &&
        (!filters.apellido || user.apellido.toLowerCase().includes(filters.apellido.toLowerCase())) &&
        (!filters.correo || user.correo.toLowerCase().includes(filters.correo.toLowerCase())) &&
        (!filters.rol || user.rol === filters.rol) &&
        (showInactive || user.activo)
      );
    });
  }, [filters, showInactive, users]);

  const getUniqueOptions = (field) => {
    const options = [...new Set(users.map(user => user[field]))];
    return options.map(option => ({ value: option, label: option }));
  };

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#ABD3A5',
      borderColor: '#ABD3A5',
      height: '50px',
      minHeight: '50px',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided) => ({
      ...provided,
      padding: 20,
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '16px',
    }),
  };

  const darkGreenButtonStyle = {
    color: '#2C5E1A'
  };

  return (
    <div className="container-custom">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Usuarios</h2>
      </div>
      
      <Form>
        <Form.Group className="mb-3">
          <Select
            styles={selectStyles}
            placeholder="Rol"
            isClearable
            onChange={(option) => handleFilterChange('rol', option ? option.value : '')}
            options={getUniqueOptions('rol')}
          />
        </Form.Group>
        <div className="row mb-3">
          <div className="col">
            <Select
              styles={selectStyles}
              placeholder="Nombre"
              isClearable
              onChange={(option) => handleFilterChange('nombre', option ? option.value : '')}
              options={getUniqueOptions('nombre')}
            />
          </div>
          <div className="col">
            <Select
              styles={selectStyles}
              placeholder="Apellido"
              isClearable
              onChange={(option) => handleFilterChange('apellido', option ? option.value : '')}
              options={getUniqueOptions('apellido')}
            />
          </div>
          <div className="col">
            <Select
              styles={selectStyles}
              placeholder="Correo"
              isClearable
              onChange={(option) => handleFilterChange('correo', option ? option.value : '')}
              options={getUniqueOptions('correo')}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Check 
            type="switch" 
            id="custom-switch" 
            label="Mostrar Inactivos" 
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          <Button variant="success" onClick={handleShow} style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}>Añadir usuario</Button>
        </div>
      </Form>
      
      {loading ? (
        <h5 className="text-center">Cargando usuarios...</h5>
      ) : error ? (
        <h5 className="text-center text-danger">{error}</h5>
      ) : filteredUsers.length === 0 ? (
        <h5 className="text-center">No hay usuarios para cargar.</h5>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="text-center">
            <thead>
              <tr className="table-header">
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.correo}</td>
                  <td>{user.rol}</td>
                  <td>{user.activo ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <Button variant="link" style={darkGreenButtonStyle} className="me-2" onClick={() => editUser(user)}>
                      <Pencil size={18} />
                    </Button>
                    <Button 
                      variant="link" 
                      style={{...darkGreenButtonStyle, opacity: user.activo ? 0.5 : 1}} 
                      className="me-2" 
                      onClick={() => confirmDeleteUser(user)}
                      disabled={user.activo}
                    >
                      <Trash2 size={18} />
                    </Button>
                    <Button variant="link" style={darkGreenButtonStyle} onClick={() => confirmChangeUserStatus(user)}>
                    {user.activo ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
                  </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      
      <EditUserModal
        user={selectedUser}
        onUpdate={() => {
          getUsers();
          setSelectedUser(null);
        }}
      />
      <CreateUserModal
        show={showCreateUserModal}
        onUpdate={() => {
          getUsers();
          handleClose();
        }}
      />
    </div>
  );
};

export default Administrador;