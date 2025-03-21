import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import Select from 'react-select';
import '../../../css/product.css';

import { Pencil, Trash2, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal'; // Importar el nuevo componente
import ViewProductModal from './ViewProductModal'; // Asegúrate de que la ruta sea correcta
import axios from 'axios'; 
import Swal from 'sweetalert2';
import { AuthContext } from '../../../../context/AuthContext'; // Agregar este import

const Product = () => {
  const { user } = useContext(AuthContext); // Obtener el usuario actual

  const initialAnimals = [
    { name: 'Charlie', commonName: 'Jirafa', family: 'Giraffidae', genus: 'Giraffa', species: 'camelopardalis', location: 'Recinto 5', condition: 'Circuito', status: 'Alta' },
    { name: 'Leo', commonName: 'León', family: 'Felidae', genus: 'Panthera', species: 'leo', location: 'Recinto 1', condition: 'Rehabilitación', status: 'Alta' },
    { name: 'Bella', commonName: 'Tigre', family: 'Felidae', genus: 'Panthera', species: 'tigris', location: 'Recinto 3', condition: 'Circuito', status: 'Baja' },
  ];

  const [filters, setFilters] = useState({
    name: '',
    commonName: '',
    scientific: '',
    sex: '',
    chip: '',
    identification: '',
  });

  const [showLow, setShowLow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [animalToEdit, setAnimalToEdit] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}animales`);
      if (Array.isArray(response.data)) {
        setAnimals(response.data);
      } else {
        console.error('La respuesta no es la esperada:', response.data);
        setAnimals([]);
      }
    } catch (error) {
      console.error('Error al obtener los animales:', error);
      setError('Error al cargar los animales. Por favor, intente de nuevo más tarde.');
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
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
  
  const filteredAnimals = useMemo(() => {
    return (animals || []).filter(animal => {
      if (!animal) return false;
  
      return (
        (!filters.name || 
          animal.pseudonimo?.toLowerCase().includes(filters.name.toLowerCase()) || 
          animal.nombreInstitucional?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.commonName || 
          animal.nombreVulgar?.toLowerCase().includes(filters.commonName.toLowerCase())) &&
        (!filters.scientific || 
          animal.nombreCientifico?.toLowerCase().includes(filters.scientific.toLowerCase())) &&
        (!filters.sex || 
          animal.sexo?.toLowerCase().includes(filters.sex.toLowerCase())) &&
        (!filters.chip || 
          animal.chipNumero?.toLowerCase().includes(filters.chip.toLowerCase())) &&
        (!filters.identification || 
          animal.anilloCaravanaIdentificacion?.toLowerCase().includes(filters.identification.toLowerCase())) &&
        (showLow || animal.activo === undefined || animal.activo)
      );
    });
  }, [filters, showLow, animals]);

  const getUniqueOptions = (field) => {
    const options = [...new Set(animals.map(animal => {
      switch(field) {
        case 'name':
          return animal.pseudonimo || animal.nombreInstitucional;
        case 'commonName':
          return animal.nombreVulgar;
        case 'scientific':
          return animal.nombreCientifico;
        case 'sex':
          return animal.sexo;
        case 'chip':
          return animal.chipNumero;
        case 'identification':
          return animal.anilloCaravanaIdentificacion;
        default:
          return '';
      }
    }).filter(Boolean))];
    return options.map(option => ({ value: option, label: option }));
  };

  const handleAddAnimal = async (newAnimal) => {
    try {
      // Lógica para agregar el animal (si es necesario)
      // ...

      // Recargar los datos
      await fetchAnimals();
      setShowModal(false);
      Swal.fire('¡Éxito!', 'Animal agregado correctamente', 'success');
    } catch (error) {
      console.error('Error al agregar el animal:', error);
      Swal.fire('Error', 'No se pudo agregar el animal', 'error');
    }
  };

  const handleDeleteAnimal = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará permanentemente al animal. ¿Deseas continuar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${import.meta.env.VITE_API_USUARIO}animales/${id}`);
        if (response.status === 200) {
          Swal.fire(
            '¡Eliminado!',
            'El animal ha sido eliminado.',
            'success'
          );
          // Actualizar la lista de animales
          setAnimals(animals.filter(animal => animal._id !== id));
        }
      }
    } catch (error) {
      console.error('Error al eliminar el animal:', error);
      Swal.fire(
        'Error',
        'No se pudo eliminar el animal. Por favor, intente de nuevo.',
        'error'
      );
    }
  };

  const handleEditAnimal = (animal) => {
    setAnimalToEdit(animal);
    setShowEditModal(true);
  };

  const handleUpdateAnimal = async (updatedAnimal) => {
    try {
      // Lógica para actualizar el animal (si es necesario)
      // ...

      // Recargar los datos
      await fetchAnimals();
      setShowEditModal(false);
      Swal.fire('¡Éxito!', 'Animal actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar el animal:', error);
      Swal.fire('Error', 'No se pudo actualizar el animal', 'error');
    }
  };

  const handleViewAnimal = (animalId) => {
    if (!animalId) {
      console.error('ID de animal no válido');
      return;
    }
    setSelectedAnimalId(animalId);
    setShowViewModal(true);
  };

  const handleDarDeBaja = async (animalId) => {
    try {
      // Dar de baja el animal
      await axios.patch(`${import.meta.env.VITE_API_USUARIO}animales/${animalId}/dar-de-baja`);
      
      // Buscar el ingreso correspondiente
      const ingresosResponse = await axios.get(`${import.meta.env.VITE_API_USUARIO}ingresos`);
      const ingreso = ingresosResponse.data.find(ing => ing.animalId === animalId);
      
      if (ingreso) {
        // Dar de baja el ingreso
        await axios.patch(`${import.meta.env.VITE_API_USUARIO}ingresos/${ingreso._id}/dar-de-baja`);
      }

      // Actualizar la lista de animales
      await fetchAnimals();
      
      Swal.fire('Éxito', 'El animal ha sido dado de baja', 'success');
    } catch (error) {
      console.error('Error al dar de baja el animal:', error);
      Swal.fire('Error', 'No se pudo dar de baja el animal', 'error');
    }
  };

  const handleDarDeAlta = async (animalId) => {
    try {
      // Dar de alta el animal
      await axios.patch(`${import.meta.env.VITE_API_USUARIO}animales/${animalId}/dar-de-alta`);
      
      // Buscar el ingreso correspondiente
      const ingresosResponse = await axios.get(`${import.meta.env.VITE_API_USUARIO}ingresos`);
      const ingreso = ingresosResponse.data.find(ing => ing.animalId === animalId);
      
      if (ingreso) {
        // Dar de alta el ingreso
        await axios.patch(`${import.meta.env.VITE_API_USUARIO}ingresos/${ingreso._id}/dar-de-alta`);
      }

      // Actualizar la lista de animales
      await fetchAnimals();
      
      Swal.fire('Éxito', 'El animal ha sido dado de alta', 'success');
    } catch (error) {
      console.error('Error al dar de alta el animal:', error);
      Swal.fire('Error', 'No se pudo dar de alta el animal', 'error');
    }
  };

  return (
    <div className="container-custom">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Animales</h2>
      </div>
      <Form>
        <div className="row mb-3">
          <div className="col-md-4">
            <Select 
              styles={selectStyles}
              placeholder="Nombre del Animal"
              isClearable
              onChange={(option) => handleFilterChange('name', option ? option.value : '')}
              options={getUniqueOptions('name')}
              value={filters.name ? { value: filters.name, label: filters.name } : null}
            />
          </div>
          <div className="col-md-4">
            <Select
              styles={selectStyles}
              placeholder="Nombre Vulgar"
              isClearable
              onChange={(option) => handleFilterChange('commonName', option ? option.value : '')}
              options={getUniqueOptions('commonName')}
              value={filters.commonName ? { value: filters.commonName, label: filters.commonName } : null}
            />
          </div>
          <div className="col-md-4">
            <Select
              styles={selectStyles}
              placeholder="Nombre Científico"
              isClearable
              onChange={(option) => handleFilterChange('scientific', option ? option.value : '')}
              options={getUniqueOptions('scientific')}
              value={filters.scientific ? { value: filters.scientific, label: filters.scientific } : null}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <Select
              styles={selectStyles}
              placeholder="Sexo"
              isClearable
              onChange={(option) => handleFilterChange('sex', option ? option.value : '')}
              options={getUniqueOptions('sex')}
              value={filters.sex ? { value: filters.sex, label: filters.sex } : null}
            />
          </div>
          <div className="col-md-4">
            <Select
              styles={selectStyles}
              placeholder="Número de Chip"
              isClearable
              onChange={(option) => handleFilterChange('chip', option ? option.value : '')}
              options={getUniqueOptions('chip')}
              value={filters.chip ? { value: filters.chip, label: filters.chip } : null}
            />
          </div>
          <div className="col-md-4">
            <Select
              styles={selectStyles}
              placeholder="Identificación"
              isClearable
              onChange={(option) => handleFilterChange('identification', option ? option.value : '')}
              options={getUniqueOptions('identification')}
              value={filters.identification ? { value: filters.identification, label: filters.identification } : null}
            />
          </div>
        </div>
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
              Nuevo Ingreso
            </Button>
          )}
        </div>
      </Form>
      {loading && <p>Cargando animales...</p>}
      {error && <p className="text-danger">{error}</p>}
      
      {!loading && !error && (
        <div className="table-responsive">
          <Table striped bordered hover className="text-center">
            <thead>
              <tr className="table-header">
                <th>Nombre del Animal</th>
                <th>Nombre Vulgar</th>
                <th>Nombre Científico</th>
                <th>Sexo</th>
                <th>Chip</th>
                <th>Identificación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnimals.map((animal, index) => (
                <tr key={animal._id || index}>
                  <td>{animal.pseudonimo || animal.nombreInstitucional}</td>
                  <td>{animal.nombreVulgar}</td>
                  <td>{animal.nombreCientifico}</td>
                  <td>{animal.sexo}</td>
                  <td>{animal.chipNumero}</td>
                  <td>{animal.anilloCaravanaIdentificacion}</td>
                  <td>{animal.activo ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <Button 
                      variant="link" 
                      style={{color: '#2C5E1A'}} 
                      className="me-2"
                      onClick={() => handleViewAnimal(animal._id)}
                    >
                      <Eye size={18} />
                    </Button>
                    {user?.rol !== "Guardafauna" && (
                      <>
                        <Button 
                          variant="link" 
                          style={{color: '#2C5E1A'}} 
                          className="me-2"
                          onClick={() => handleEditAnimal(animal)}
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button 
                          variant="link" 
                          style={{color: '#2C5E1A'}} 
                          className="me-2"
                          onClick={() => handleDeleteAnimal(animal._id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                        <Button variant="link" style={{color: '#2C5E1A'}}>
                          <ArrowUp size={18} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <AddProductModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleAdd={handleAddAnimal}
      />
      <EditProductModal 
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        handleEdit={handleUpdateAnimal}
        animalToEdit={animalToEdit}
      />
      <ViewProductModal 
        show={showViewModal}
        handleClose={() => {
          setShowViewModal(false);
          setSelectedAnimalId(null); // Limpiar el ID seleccionado al cerrar
        }}
        animalId={selectedAnimalId}
      />
    </div>
  );
};

export default Product;