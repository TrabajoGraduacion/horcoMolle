import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Form, Button, Table, Dropdown } from 'react-bootstrap';
import Select from 'react-select';
import { Pencil, Trash2, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import '../../../../css/eventoanimal.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../../../context/AuthContext';
//Dieta
import AddDietaModal from './Dieta/AddDietaModal';
import EditDietaModal from './Dieta/EditDietaModal';
import ViewDietaModal from './Dieta/ViewDietaModal';
//Ficha Clinica
import AddFichaClinicaModal from './FichaClinica/AddFichaClinicaModal';
// import EditFichaClinicaModal from './FichaClinica/EditFichaClinicaModal';
import ViewFichaClinicaModal from './FichaClinica/ViewFichaClinicaModal';
//Egreso
import AddEgresoModal from './Egreso/AddEgresoModal';
import ViewEgresoModal from './Egreso/ViewEgresoModal';
import EditEgresoModal from './Egreso/EditEgresoModal';
//Enriquecimiento
import AddEnriquecimientoModal from './Enriquecimiento/AddEnriquecimientoModal';
import EditEnriquecimientoModal from './Enriquecimiento/EditEnriquecimientoModal';
import ViewEnriquecimientoModal from './Enriquecimiento/ViewEnriquecimientoModal';
//Observacion Diaria
import AddObservacionDiariaModal from './ObservacionDiaria/AddObservacionDiariaModal';
import EditObservacionDiariaModal from './ObservacionDiaria/EditObservacionDiariaModal';
import ViewObservacionDiariaModal from './ObservacionDiaria/ViewObservacionDiariaModal';
//Relocalizacion
import AddRelocalizacionModal from './Relocalizacion/AddRelocalizacionModal';
import EditRelocalizacionModal from './Relocalizacion/EditRelocalizacionModal';
import ViewRelocalizacionModal from './Relocalizacion/ViewRelocalizacionModal';

const EventoAnimal = ({ cambiarSeccion }) => {
  const { user } = useContext(AuthContext);
  const [eventType, setEventType] = useState(null);
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
    startDate: '',
    endDate: '',
  });
  const [showLow, setShowLow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDietaModal, setShowDietaModal] = useState(false);
  const [dietas, setDietas] = useState([]);
  const [showEditDietaModal, setShowEditDietaModal] = useState(false);
  const [dietaToEdit, setDietaToEdit] = useState(null);
  const [showViewDietaModal, setShowViewDietaModal] = useState(false)
  const [dietaToView, setDietaToView] = useState(null);
  const [showFichaClinicaModal, setShowFichaClinicaModal] = useState(false);
  const [showViewEgresoModal, setShowViewEgresoModal] = useState(false);
  const [egresoToView, setEgresoToView] = useState(null);
  const [showEditEgresoModal, setShowEditEgresoModal] = useState(false);
  const [egresoToEdit, setEgresoToEdit] = useState(null);
  const [showEnriquecimientoModal, setShowEnriquecimientoModal] = useState(false);
  const [showEditEnriquecimientoModal, setShowEditEnriquecimientoModal] = useState(false);
  const [enriquecimientoToEdit, setEnriquecimientoToEdit] = useState(null);
  const [showViewEnriquecimientoModal, setShowViewEnriquecimientoModal] = useState(false);
  const [enriquecimientoToView, setEnriquecimientoToView] = useState(null);

  //Observacion Diaria
  const [showObservacionDiariaModal, setShowObservacionDiariaModal] = useState(false);
  const [showEditObservacionDiariaModal, setShowEditObservacionDiariaModal] = useState(false);
  const [observacionDiariaToEdit, setObservacionDiariaToEdit] = useState(null);
  const [showViewObservacionDiariaModal, setShowViewObservacionDiariaModal] = useState(false);
  const [observacionDiariaToView, setObservacionDiariaToView] = useState(null);

  //Relocalizacion
  const [showRelocalizacionModal, setShowRelocalizacionModal] = useState(false);
  const [showEditRelocalizacionModal, setShowEditRelocalizacionModal] = useState(false);
  const [relocalizacionToEdit, setRelocalizacionToEdit] = useState(null);
  const [showViewRelocalizacionModal, setShowViewRelocalizacionModal] = useState(false);
  const [relocalizacionToView, setRelocalizacionToView] = useState(null);
  const [showViewFichaClinicaModal, setShowViewFichaClinicaModal] = useState(false);
  const [fichaClinicaToView, setFichaClinicaToView] = useState(null);
  
  const eventTypeOptions = useMemo(() => {
    if (user?.rol === "Guardafauna") {
      return [
        { value: 'observacionDiaria', label: 'Observación diaria' }
      ];
    }

    return [
      { value: 'dieta', label: 'Dieta' },
      { value: 'egreso', label: 'Egreso' },
      { value: 'enriquecimiento', label: 'Enriquecimiento' },
      { value: 'fichaClinica', label: 'Ficha clínica' },
      { value: 'observacionDiaria', label: 'Observación diaria' },
      { value: 'relocalizacion', label: 'Relocalización' },
    ];
  }, [user?.rol]);

  useEffect(() => {
    if (eventType) {
      fetchEvents();
    } else {
      setIsLoading(false);
    }
  }, [eventType]);

  const fetchEvents = async () => {
    if (!eventType) return;

    setIsLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_USUARIO}`;
      switch (eventType) {
        case 'dieta':
          url += 'dietas';
          break;
        case 'egreso':
          url += 'egresos';
          break;
        case 'enriquecimiento':
          url += 'enriquecimiento';
          break;
        case 'fichaClinica':
          url += 'fichaClinica';
          break;
        case 'observacionDiaria':
          url += 'observaciones-diarias';
          break;
        case 'relocalizacion':
          url += 'relocalizacion';
          break;
        default:
          setIsLoading(false);
          return;
      }
      
      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        const transformedEvents = response.data.map(event => transformEventData(event));
        setEvents(transformedEvents);
      } else {
        console.error('La respuesta de la API no es un array');
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      Swal.fire('Error', 'No se pudieron cargar los eventos', 'error');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const transformEventData = (event) => {
    const getFormattedDate = (dateString) => {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date) 
        ? date.toLocaleDateString('es-ES', { timeZone: 'UTC' })
        : 'Fecha no disponible';
    };
  
    const formatCamelCase = (string) => {
      return string
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
  
    let transformedEvent = {
      id: event._id,
      type: formatCamelCase(eventType),
      date: getFormattedDate(event.fechaRelocalizacion || event.fechaObservacion || event.fecha || event.createdAt || event.fechaEvaluacion || event.creadoEn),
      status: event.activo ? 'Alta' : 'Baja',
      realizadoPor: event.realizadoPor
    };
  
    // Manejar la información del animal según el tipo de evento
    switch (eventType) {
      case 'relocalizacion':
        transformedEvent.animal = event.nombreInstitucionalAnimal;
        transformedEvent.recintoAnterior = event.nombreRecintoAnterior;
        transformedEvent.recintoNuevo = event.nombreRecintoNuevo;
        break;
      case 'observacionDiaria':
        transformedEvent.animal = event.nombreInstitucionalAnimal;
        break;
      default:
        transformedEvent.animal = event.nombreInstitucionalAnimal || event.animal?.nombreInstitucional || event.animal || 'No especificado';
    }
  
    return transformedEvent;
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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    return events.filter(event => {
      return (
        (!filters.keyword || 
         event.type.toLowerCase().includes(filters.keyword.toLowerCase()) ||
         event.animal.toLowerCase().includes(filters.keyword.toLowerCase())) &&
        (!filters.startDate || new Date(event.date) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(event.date) <= new Date(filters.endDate)) &&
        (showLow || event.status !== 'Baja')
      );
    });
  }, [filters, showLow, events]);

  const handleRecintosClick = () => {
    cambiarSeccion('eventoRecinto');
  };

  const handleAddEnriquecimiento = (nuevoEnriquecimiento) => {
    setEvents(prevEvents => [...prevEvents, transformEventData(nuevoEnriquecimiento)]);
    fetchEvents(); // Recargar eventos después de añadir un enriquecimiento
    // Aquí puedes agregar cualquier otra lógica necesaria después de agregar un enriquecimiento
  };

  const handleAddObservacionDiaria = (nuevaObservacionDiaria) => {
    setEvents(prevEvents => [...prevEvents, transformEventData(nuevaObservacionDiaria)]);
    fetchEvents();
  };

  const handleEditObservacionDiaria = (updatedObservacionDiaria) => {
    setEvents(prevEvents => prevEvents.map(event => 
      event.id === updatedObservacionDiaria._id ? { ...event, ...transformEventData(updatedObservacionDiaria) } : event
    ));
    fetchEvents();
  };

  const handleAddRelocalizacion = (nuevaRelocalizacion) => {
    setEvents(prevEvents => [...prevEvents, transformEventData(nuevaRelocalizacion)]);
    fetchEvents();
  };

  const handleEditRelocalizacion = (updatedRelocalizacion) => {
    setEvents(prevEvents => prevEvents.map(event => 
      event.id === updatedRelocalizacion._id ? { ...event, ...transformEventData(updatedRelocalizacion) } : event
    ));
    fetchEvents();
  };

  const toggleEventStatus = async (event) => {
    const eventTypes = {
      dieta: 'dietas',
      egreso: 'egresos',
      enriquecimiento: 'enriquecimiento',
      observacionDiaria: 'observaciones-diarias',
      relocalizacion: 'relocalizacion'
    };
    if (eventTypes[eventType]) {
      const action = event.status === 'Alta' ? 'dar-de-baja' : 'dar-de-alta';
      const confirmationMessage = event.status === 'Alta' ? 'dar de baja' : 'dar de alta';
      
      Swal.fire({
        title: `¿Está seguro de que desea ${confirmationMessage} este ${eventType}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Sí, ${confirmationMessage}`,
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${import.meta.env.VITE_API_USUARIO}${eventTypes[eventType]}/${event.id}/${action}`);
            Swal.fire('Actualizado', `El ${eventType} ha sido ${event.status === 'Alta' ? 'dado de baja' : 'dado de alta'}.`, 'success');
            fetchEvents(); // Recargar eventos después de cambiar el estado
          } catch (error) {
            console.error(`Error al ${confirmationMessage} el ${eventType}:`, error);
            Swal.fire('Error', `Hubo un problema al ${confirmationMessage} el ${eventType}.`, 'error');
          }
        }
      });
    } else {
      // Implementar la lógica para cambiar el estado de otros tipos de eventos
      console.log("Cambio de estado para otros tipos de eventos no implementado");
    }
  };

  const deleteEvent = async (id) => {
    const eventTypes = {
      dieta: 'dietas',
      egreso: 'egresos',
      enriquecimiento: 'enriquecimiento',
      observacionDiaria: 'observaciones-diarias',
      relocalizacion: 'relocalizacion'
    };
  
    if (eventTypes[eventType]) {
      Swal.fire({
        title: '¿Está seguro?',
        text: `Esta acción eliminará el ${eventType} de forma permanente.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`${import.meta.env.VITE_API_USUARIO}${eventTypes[eventType]}/${id}`);
            fetchEvents(); // Recargar eventos después de eliminar
            Swal.fire(
              'Eliminado!',
              `El ${eventType} ha sido eliminado.`,
              'success'
            );
          } catch (error) {
            console.error(`Error al eliminar el ${eventType}:`, error);
            Swal.fire(
              'Error',
              `No se pudo eliminar el ${eventType}.`,
              'error'
            );
          }
        }
      });
    } else {
      // Lógica para eliminar otros tipos de eventos
      
    }
  };

  const darkGreenButtonStyle = {
    color: '#2C5E1A'
  };

  const disabledButtonStyle = {
    color: '#A0A0A0',
    cursor: 'not-allowed'
  };

  const handleAddDieta = (nuevaDieta) => {
    setDietas(prevDietas => [...prevDietas, nuevaDieta]);
    fetchEvents(); // Recargar eventos después de añadir una dieta
    // Aquí puedes agregar cualquier otra lógica necesaria después de agregar una dieta
  };

  const handleEditClick = async (eventId) => {
    if (eventType === 'egreso') {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}egresos/${eventId}`);
        setEgresoToEdit(response.data);
        setShowEditEgresoModal(true);
      } catch (error) {
        console.error('Error al obtener los datos del egreso:', error);
        Swal.fire('Error', 'No se pudo cargar el egreso para editar', 'error');
      }
    } else if (eventType === 'dieta') {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}dietas/${eventId}`);
      setDietaToEdit(response.data);
      setShowEditDietaModal(true);
    } catch (error) {
      console.error('Error al obtener los datos de la dieta:', error);
      Swal.fire('Error', 'No se pudo cargar la dieta para editar', 'error');
    }
  }
  else if (eventType === 'enriquecimiento') {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}enriquecimiento/${eventId}`);
      setEnriquecimientoToEdit(response.data);
      setShowEditEnriquecimientoModal(true);
    } catch (error) {
      console.error('Error al obtener los datos del enriquecimiento:', error);
      Swal.fire('Error', 'No se pudo cargar el enriquecimiento para editar', 'error');
    }
  }
  else if (eventType === 'observacionDiaria') {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}observaciones-diarias/${eventId}`);
      setObservacionDiariaToEdit(response.data);
      setShowEditObservacionDiariaModal(true);
    } catch (error) {
      console.error('Error al obtener los datos de la observación diaria:', error);
      Swal.fire('Error', 'No se pudo cargar la observación diaria para editar', 'error');
    }
  }else if (eventType === 'relocalizacion') {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}relocalizacion/${eventId}`);
      setRelocalizacionToEdit(response.data);
      setShowEditRelocalizacionModal(true);
    } catch (error) {
      console.error('Error al obtener los datos de la relocalización:', error);
      Swal.fire('Error', 'No se pudo cargar la relocalización para editar', 'error');
    }
  }
};

  const handleEditDieta = (updatedDieta) => {
    setEvents(prevEvents => prevEvents.map(event => 
      event.id === updatedDieta._id ? { ...event, ...transformEventData(updatedDieta) } : event
    ));
    fetchEvents(); // Recargar eventos después de editar una dieta
  };

  const handleEditEgreso = (updatedEgreso) => {
    setEvents(prevEvents => prevEvents.map(event => 
      event.id === updatedEgreso._id ? { ...event, ...transformEventData(updatedEgreso) } : event
    ));
    fetchEvents(); // Recargar eventos después de editar un egreso
  };

  const handleEditEnriquecimiento = (updatedEnriquecimiento) => {
    setEvents(prevEvents => prevEvents.map(event => 
      event.id === updatedEnriquecimiento._id ? { ...event, ...transformEventData(updatedEnriquecimiento) } : event
    ));
    fetchEvents(); // Recargar eventos después de editar un enriquecimiento
  };

  const handleViewClick = async (eventId) => {
    if (eventType === 'fichaClinica') {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}fichaclinica/${eventId}`);
        
        setFichaClinicaToView({
          id: eventId,
          ...response.data
        });
        setShowViewFichaClinicaModal(true);
      } catch (error) {
        console.error('Error al obtener los datos de la ficha clínica:', error);
        Swal.fire('Error', 'No se pudo cargar la ficha clínica para ver', 'error');
      }
    } else if (eventType === 'egreso') {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}egresos/${eventId}`);
        setEgresoToView(response.data);
        setShowViewEgresoModal(true);
      } catch (error) {
        console.error('Error al obtener los datos del egreso:', error);
        Swal.fire('Error', 'No se pudo cargar el egreso para ver', 'error');
      }
    } else if (eventType === 'dieta') {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}dietas/${eventId}`);
      setDietaToView(response.data);
      setShowViewDietaModal(true);
    } catch (error) {
      console.error('Error al obtener los datos de la dieta:', error);
      Swal.fire('Error', 'No se pudo cargar la dieta para ver', 'error');
    }
  } else if (eventType === 'enriquecimiento') {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}enriquecimiento/${eventId}`);
      setEnriquecimientoToView(response.data);
      setShowViewEnriquecimientoModal(true);
    } catch (error) {
      console.error('Error al obtener los datos del enriquecimiento:', error);
      Swal.fire('Error', 'No se pudo cargar el enriquecimiento para ver', 'error');
    }
  } else if (eventType === 'observacionDiaria') {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}observaciones-diarias/${eventId}`);
      setObservacionDiariaToView(response.data);
      setShowViewObservacionDiariaModal(true);
    } catch (error) {
      console.error('Error al obtener los datos de la observación diaria:', error);
      Swal.fire('Error', 'No se pudo cargar la observación diaria para ver', 'error');
    }
  } else if (eventType === 'relocalizacion') {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}relocalizacion/${eventId}`);
      setRelocalizacionToView(response.data);
      setShowViewRelocalizacionModal(true);
    } catch (error) {
      console.error('Error al obtener los datos de la relocalización:', error);
      Swal.fire('Error', 'No se pudo cargar la relocalización para ver', 'error');
    }
  }
}

  const [showEgresoModal, setShowEgresoModal] = useState(false);
  const handleAddEgreso = (nuevoEgreso) => {
    setEvents(prevEvents => [...prevEvents, transformEventData(nuevoEgreso)]);
    fetchEvents(); // Recargar eventos después de añadir un egreso
    // Aquí puedes agregar cualquier otra lógica necesaria después de agregar un egreso
  };

  // Agregar el handler para ficha clínica
  const handleAddFichaClinica = (nuevaFichaClinica) => {
    setEvents(prevEvents => [...prevEvents, transformEventData(nuevaFichaClinica)]);
    fetchEvents(); // Recargar eventos después de añadir una ficha clínica
  };

  const renderActionButtons = (event) => {
    // Siempre mostrar el botón de ver
    const viewButton = (
      <Button 
        variant="link" 
        style={darkGreenButtonStyle} 
        className="me-2"
        onClick={() => handleViewClick(event.id)}
      >
        <Eye size={18} />
      </Button>
    );

    // Si es Guardafauna
    if (user?.rol === "Guardafauna") {
      return (
        <>
          {viewButton}
          {/* Mostrar el lápiz solo si la observación fue creada por el usuario actual */}
          {eventType === 'observacionDiaria' && event.realizadoPor === user._id && (
            <Button 
              variant="link" 
              style={darkGreenButtonStyle} 
              className="me-2"
              onClick={() => handleEditClick(event.id)}
            >
              <Pencil size={18} />
            </Button>
          )}
        </>
      );
    }

    // Para otros roles, mostrar todos los botones
    return (
      <>
        {viewButton}
        <Button 
          variant="link" 
          style={darkGreenButtonStyle} 
          className="me-2"
          onClick={() => handleEditClick(event.id)}
        >
          <Pencil size={18} />
        </Button>
        <Button 
          variant="link" 
          style={event.status === 'Alta' ? disabledButtonStyle : darkGreenButtonStyle} 
          className="me-2"
          onClick={() => event.status === 'Baja' && deleteEvent(event.id)}
          disabled={event.status === 'Alta'}
        >
          <Trash2 size={18} />
        </Button>
        <Button 
          variant="link" 
          onClick={() => toggleEventStatus(event)}
          style={darkGreenButtonStyle}
        >
          {event.status === 'Alta' ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
        </Button>
      </>
    );
  };

  return (
    <div className="container-custom">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h2 className="mb-2 mb-md-0">Gestión Eventos de Animales</h2>
        <div className="section-buttons">
          <Button 
            variant="success" 
            className="section-button"
            style={{
              backgroundColor: '#70AA68', 
              borderColor: '#70AA68',
              whiteSpace: 'nowrap'
            }}
          >
            Animales
          </Button>
          <Button 
            variant="outline-success" 
            className="section-button"
            style={{
              borderColor: '#70AA68', 
              color: '#70AA68',
              whiteSpace: 'nowrap'
            }}
            onClick={handleRecintosClick}
          >
            Recintos
          </Button>
        </div>
      </div>

      <Select
        options={eventTypeOptions}
        value={eventTypeOptions.find(option => option.value === eventType)}
        onChange={(selectedOption) => setEventType(selectedOption.value)}
        placeholder="Seleccione un tipo de evento"
        styles={selectStyles}
        className="mb-3"
      />

      {eventType && isLoading ? (
        <p>Cargando...</p>
      ) : eventType ? (
        <>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control 
                type="text" 
                placeholder="Búsqueda por Palabras Clave"
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                style={{backgroundColor: '#ABD3A5', borderColor: '#ABD3A5', height: '50px'}}
              />
            </Form.Group>
            <div className="row mb-3">
              <div className="col">
                <Form.Control 
                  type="date" 
                  placeholder="Fecha de Inicio"
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  style={{backgroundColor: '#ABD3A5', borderColor: '#ABD3A5', height: '50px'}}
                />
              </div>
              <div className="col">
                <Form.Control 
                  type="date" 
                  placeholder="Fecha de Fin"
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  style={{backgroundColor: '#ABD3A5', borderColor: '#ABD3A5', height: '50px'}}
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                {user?.rol !== "Guardafauna" && (
                  <Form.Check 
                    type="switch" 
                    id="custom-switch" 
                    label="Mostrar Bajas" 
                    checked={showLow}
                    onChange={(e) => setShowLow(e.target.checked)}
                  />
                )}
              </div>
              
              <div>
                {user?.rol === "Guardafauna" ? (
                  <Button 
                    variant="success" 
                    onClick={() => setShowObservacionDiariaModal(true)}
                    style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}
                  >
                    Nueva Observación Diaria
                  </Button>
                ) : (
                  eventType === 'fichaClinica' ? (
                    <Button 
                      variant="success" 
                      onClick={() => setShowFichaClinicaModal(true)}
                      style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}
                    >
                      Nueva Ficha Clínica
                    </Button>
                  ) : (
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic" style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}>
                        Nuevo Evento
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setShowDietaModal(true)}>Dieta</Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowEgresoModal(true)}>Egreso</Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowEnriquecimientoModal(true)}>Enriquecimiento</Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowFichaClinicaModal(true)}>Ficha clínica</Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowObservacionDiariaModal(true)}>Observación diaria</Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowRelocalizacionModal(true)}>Relocalización</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )
                )}
              </div>
            </div>
          </Form>
          
          <div className="table-responsive">
            <Table striped bordered hover className='text-center'>
              <thead>
                <tr className="table-header" style={{backgroundColor: '#70AA68', color: 'white'}}>
                  <th>Tipo de Evento</th>
                  <th>Animal</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.type}</td>
                      <td>{event.animal}</td>
                      <td>{event.date}</td>
                      <td>{event.status}</td>
                      <td>
                        {renderActionButtons(event)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No hay eventos para mostrar</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <p>Por favor, seleccione un tipo de evento para ver los datos.</p>
      )}

      <AddDietaModal 
        show={showDietaModal}
        handleClose={() => setShowDietaModal(false)}
        handleAdd={handleAddDieta} // Pasamos la función handleAdd como prop
      />
      <EditDietaModal 
        show={showEditDietaModal}
        handleClose={() => {
          setShowEditDietaModal(false);
          setDietaToEdit(null);
        }}
        handleEdit={handleEditDieta}
        dietaToEdit={dietaToEdit}
      />
       <ViewDietaModal 
        show={showViewDietaModal}
        handleClose={() => {
          setShowViewDietaModal(false);
          setDietaToView(null);
        }}
        dieta={dietaToView}
      />
      <AddFichaClinicaModal 
        show={showFichaClinicaModal}
        handleClose={() => setShowFichaClinicaModal(false)}
        handleAdd={handleAddFichaClinica} // Agregar esta prop
      />
<AddEgresoModal 
        show={showEgresoModal}
        handleClose={() => setShowEgresoModal(false)}
        handleAdd={handleAddEgreso}
      />
      <ViewEgresoModal 
        show={showViewEgresoModal}
        handleClose={() => {
          setShowViewEgresoModal(false);
          setEgresoToView(null);
        }}
        egreso={egresoToView}
      />
      <EditEgresoModal 
        show={showEditEgresoModal}
        handleClose={() => {
          setShowEditEgresoModal(false);
          setEgresoToEdit(null);
        }}
        handleEdit={handleEditEgreso}
        egresoToEdit={egresoToEdit}
      />
      <AddEnriquecimientoModal 
  show={showEnriquecimientoModal}
  handleClose={() => setShowEnriquecimientoModal(false)}
  handleAdd={handleAddEnriquecimiento}
/>
<EditEnriquecimientoModal 
      show={showEditEnriquecimientoModal}
      handleClose={() => {
        setShowEditEnriquecimientoModal(false);
        setEnriquecimientoToEdit(null);
      }}
      handleEdit={handleEditEnriquecimiento}
      enriquecimientoToEdit={enriquecimientoToEdit}
    />
    <ViewEnriquecimientoModal 
        show={showViewEnriquecimientoModal}
        handleClose={() => {
          setShowViewEnriquecimientoModal(false);
          setEnriquecimientoToView(null);
        }}
        enriquecimiento={enriquecimientoToView}
      />
      <AddObservacionDiariaModal
        show={showObservacionDiariaModal}
        handleClose={() => setShowObservacionDiariaModal(false)}
        handleAdd={handleAddObservacionDiaria}
      />
      <EditObservacionDiariaModal
        show={showEditObservacionDiariaModal}
        handleClose={() => {
          setShowEditObservacionDiariaModal(false);
          setObservacionDiariaToEdit(null);
        }}
        handleEdit={handleEditObservacionDiaria}
        observacionToEdit={observacionDiariaToEdit}
      />
      <ViewObservacionDiariaModal
        show={showViewObservacionDiariaModal}
        handleClose={() => {
          setShowViewObservacionDiariaModal(false);
          setObservacionDiariaToView(null);
        }}
        observacion={observacionDiariaToView}
      />
      <AddRelocalizacionModal
        show={showRelocalizacionModal}
        handleClose={() => setShowRelocalizacionModal(false)}
        handleAdd={handleAddRelocalizacion}
      />
      <EditRelocalizacionModal
        show={showEditRelocalizacionModal}
        handleClose={() => {
          setShowEditRelocalizacionModal(false);
          setRelocalizacionToEdit(null);
        }}
        handleEdit={handleEditRelocalizacion}
        relocalizacionToEdit={relocalizacionToEdit}
      />
      <ViewRelocalizacionModal
        show={showViewRelocalizacionModal}
        handleClose={() => {
          setShowViewRelocalizacionModal(false);
          setRelocalizacionToView(null);
        }}
        relocalizacion={relocalizacionToView}
      />
      <ViewFichaClinicaModal
        show={showViewFichaClinicaModal}
        handleClose={() => {
          setShowViewFichaClinicaModal(false);
          setFichaClinicaToView(null);
        }}
        fichaClinica={fichaClinicaToView}
      />

    </div>
    
  );
};

export default EventoAnimal;