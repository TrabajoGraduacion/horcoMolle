import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import Select from 'react-select';
import { Pencil, Trash2, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import AddOfferModal from './AddOfferModal'; 
import axios from 'axios';
import EditRecintoModal from './EditRecintoModal';
import ViewRecintoModal from './ViewRecintoModal';
import Swal from 'sweetalert2';
import Viewer from 'react-viewer';
import { AuthContext } from '../../../../context/AuthContext';

const Hojita = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ nombre: '' });
  const [showLow, setShowLow] = useState(false);
  const [recintos, setRecintos] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [recintoToEdit, setRecintoToEdit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecintoId, setSelectedRecintoId] = useState(null);
  const [croquis, setCroquis] = useState([]);
  const [visible, setVisible] = useState(false);
  const fileInputRef = useRef(null);

  // Función reutilizable para obtener la lista de recintos
  const fetchRecintos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}recintos`);
      setRecintos(response.data);
    } catch (error) {
      console.error('Error al obtener los recintos:', error);
    }
  };

  // Obtener recintos al cargar el componente
  useEffect(() => {
    fetchRecintos();
  }, []);

  // Obtener cualquier imagen almacenada en "recintos/croquis"
  useEffect(() => {
    const fetchCroquis = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}croquis`);
        if (response.data.length > 0) {
          setCroquis(response.data.map(croquis => ({
            src: croquis.url,
            alt: 'Croquis del recinto',
            public_id: croquis.public_id
          })));
        }
      } catch (error) {
        console.error('Error al obtener el croquis:', error);
      }
    };

    fetchCroquis(); // Llamada para obtener los croquis al cargar la página
  }, []);

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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredRecintos = useMemo(() => {
    return recintos.filter(recinto => {
      return (
        (!filters.nombre || recinto.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) &&
        (showLow || recinto.activo)
      );
    });
  }, [filters, showLow, recintos]);

  const getUniqueOptions = (field) => {
    const options = [...new Set(recintos.map(recinto => recinto[field]))];
    return options.map(option => ({ value: option, label: option }));
  };

  const handleAddRecinto = (newRecinto) => {
    setRecintos(prevRecintos => [...prevRecintos, newRecinto]);
    fetchRecintos(); // Actualizar lista de recintos
  };

  const handleEditClick = (recinto) => {
    setRecintoToEdit(recinto);
    setShowEditModal(true);
  };

  const handleEditRecinto = (updatedRecinto) => {
    setRecintos(prevRecintos => prevRecintos.map(recinto => 
      recinto._id === updatedRecinto._id ? updatedRecinto : recinto
    ));
    fetchRecintos(); // Actualizar lista de recintos
  };

  const handleViewClick = (recintoId) => {
    setSelectedRecintoId(recintoId);
    setShowViewModal(true);
  };

  const handleDeleteClick = (recintoId) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción eliminará el recinto de forma permanente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRecinto(recintoId);
      }
    });
  };

  const deleteRecinto = async (recintoId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_USUARIO}recintos/${recintoId}`);
      setRecintos(prevRecintos => prevRecintos.filter(recinto => recinto._id !== recintoId));
      Swal.fire('¡Eliminado!', 'El recinto ha sido eliminado.', 'success');
    } catch (error) {
      console.error('Error al eliminar el recinto:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar el recinto.', 'error');
    }
  };

  const handleAltaBajaClick = async (recintoId, activo) => {
    const action = activo ? 'dar-de-baja' : 'dar-de-alta';
    const confirmationMessage = activo ? 'dar de baja' : 'dar de alta';
    
    Swal.fire({
      title: `¿Está seguro de que desea ${confirmationMessage} este recinto?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ${confirmationMessage}`,
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${import.meta.env.VITE_API_USUARIO}recintos/${recintoId}/${action}`);
          setRecintos(prevRecintos => 
            prevRecintos.map(recinto => 
              recinto._id === recintoId ? { ...recinto, activo: !activo } : recinto
            )
          );
          Swal.fire('Actualizado', `El recinto ha sido ${activo ? 'dado de baja' : 'dado de alta'}.`, 'success');
          fetchRecintos(); // Actualizar lista de recintos
        } catch (error) {
          console.error(`Error al ${activo ? 'dar de baja' : 'dar de alta'} el recinto:`, error);
          Swal.fire('Error', `Hubo un problema al ${activo ? 'dar de baja' : 'dar de alta'} el recinto.`, 'error');
        }
      }
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('croquis', file);

      try {
        console.log('Subiendo croquis, NO fotos del recinto');
        const response = await axios.post(`${import.meta.env.VITE_API_USUARIO}croquis/subir`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setCroquis([{ src: response.data.url, alt: 'Nuevo Croquis', public_id: response.data.public_id }]);
        Swal.fire({
          title: '¡Croquis subido exitosamente!',
          text: 'El croquis de la reserva ha sido actualizado en el sistema',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#70AA68',
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            popup: 'swal2-show',
            title: 'text-lg font-semibold',
            confirmButton: 'px-4 py-2 rounded-lg'
          }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error al subir el croquis',
          text: 'No se pudo procesar la imagen. Por favor, inténtelo nuevamente.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#70AA68',
          customClass: {
            popup: 'swal2-show',
            title: 'text-lg font-semibold',
            confirmButton: 'px-4 py-2 rounded-lg'
          }
        });
      }
    }
  };

  const handleDeleteCroquis = async () => {
    const public_id = croquis[0].public_id;

    try {
      await axios.delete(`${import.meta.env.VITE_API_USUARIO}croquis/eliminar`, { data: { public_id } });
      setCroquis([]);
      Swal.fire({
        title: 'Croquis eliminado',
        text: 'El croquis ha sido eliminado correctamente del sistema',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#70AA68',
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal2-show',
          title: 'text-lg font-semibold',
          confirmButton: 'px-4 py-2 rounded-lg'
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error al eliminar',
        text: 'No se pudo eliminar el croquis. Por favor, inténtelo nuevamente.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#70AA68',
        customClass: {
          popup: 'swal2-show',
          title: 'text-lg font-semibold',
          confirmButton: 'px-4 py-2 rounded-lg'
        }
      });
    }
  };

  return (
    <div className="container-custom">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Recintos</h2>
      </div>
      <div className="row mb-3">
        <div className="col-md-8">
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '10px', 
            padding: '10px', 
            width: '100%',
            minHeight: '300px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
          }}>
            {croquis.length > 0 ? (
              <img 
                src={croquis[0].src}
                alt={croquis[0].alt}
                className="img-fluid" 
                style={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}
                onClick={() => setVisible(true)}
              />
            ) : (
              <div className="text-center">
                <i className="fas fa-image fa-3x mb-3" style={{ color: '#70AA68' }}></i>
                <h4 style={{ color: '#666' }}>No hay croquis disponible</h4>
                <p style={{ color: '#888' }}>Suba una imagen para visualizar el croquis de la reserva</p>
              </div>
            )}
            <Viewer
              visible={visible}
              onClose={() => setVisible(false)}
              images={croquis}
              zoomable
              scalable
              rotatable
            />
          </div>
        </div>
        {user?.rol !== "Guardafauna" && (
          <div className="col-md-4 d-flex flex-column justify-content-center">
            <Button 
              variant="success" 
              className="mb-2" 
              style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}
              onClick={handleUploadClick}
              disabled={croquis.length > 0}
            >
              Subir Nuevo Croquis
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                console.log('Subiendo croquis, NO fotos del recinto');
                handleFileChange(e);
              }}
              style={{ display: 'none' }}
              accept="image/*"
            />
            {croquis.length > 0 && (
              <Button variant="danger" onClick={handleDeleteCroquis}>
                Eliminar Croquis
              </Button>
            )}
          </div>
        )}
      </div>
      <Form>
        <Form.Group className="mb-3">
          <Select 
            styles={selectStyles}
            placeholder="Nombre"
            isClearable
            onChange={(option) => handleFilterChange('nombre', option ? option.value : '')}
            options={getUniqueOptions('nombre')}
          />
        </Form.Group>
        <div className="d-flex justify-content-between align-items-center mb-3">
          {user?.rol !== "Guardafauna" && (
            <Form.Check 
              type="switch" 
              id="custom-switch" 
              label="Mostrar Bajas" 
              checked={showLow}
              onChange={(e) => setShowLow(e.target.checked)}
            />
          )}
          {user?.rol !== "Guardafauna" && (
            <Button 
              variant="success" 
              onClick={() => setShowModal(true)} 
              style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}
            >
              Nuevo Recinto
            </Button>
          )}
        </div>
      </Form>
      
      <div className="table-responsive">
        <Table striped bordered hover className="text-center">
          <thead>
            <tr className="table-header">
              <th>Nombre del Recinto</th>
              <th>Código</th>
              <th>Especie</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecintos.map((recinto) => (
              <tr key={recinto._id}>
                <td>{recinto.nombre}</td>
                <td>{recinto.codigo}</td>
                <td>{recinto.especie}</td>
                <td>{recinto.activo ? 'Alta' : 'Baja'}</td>
                <td>
                  <Button 
                    variant="link" 
                    style={{color: '#2C5E1A'}} 
                    className="me-2"
                    onClick={() => handleViewClick(recinto._id)}
                  >
                    <Eye size={18} />
                  </Button>
                  {user?.rol !== "Guardafauna" && (
                    <>
                      <Button 
                        variant="link" 
                        style={{color: '#2C5E1A'}} 
                        className="me-2"
                        onClick={() => handleEditClick(recinto)}
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button 
                        variant="link" 
                        style={{color: '#2C5E1A'}} 
                        className="me-2"
                        onClick={() => handleDeleteClick(recinto._id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                      <Button 
                        variant="link" 
                        style={{color: '#2C5E1A'}} 
                        onClick={() => handleAltaBajaClick(recinto._id, recinto.activo)}
                      >
                        {recinto.activo ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <AddOfferModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          fetchRecintos(); // Actualizar lista al cerrar el modal de agregar
        }}
        handleAdd={handleAddRecinto}
      />
      <EditRecintoModal
        show={showEditModal}
        handleClose={() => {
          setShowEditModal(false);
          fetchRecintos(); // Actualizar lista al cerrar el modal de edición
        }}
        handleEdit={handleEditRecinto}
        recintoToEdit={recintoToEdit}
      />
      <ViewRecintoModal
        show={showViewModal}
        handleClose={() => {
          setShowViewModal(false);
          fetchRecintos(); // Actualizar lista al cerrar el modal de vista
        }}
        recintoId={selectedRecintoId}
      />
    </div>
  );
};

export default Hojita;
