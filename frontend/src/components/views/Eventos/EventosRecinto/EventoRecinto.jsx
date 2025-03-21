import React, { useState, useMemo, useEffect, useCallback, useContext } from 'react';
import { Form, Button, Table, Dropdown, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import Select from 'react-select';
import { Pencil, Trash2, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddEvaluacionModal from '../EventosRecinto/Evaluacion/AddEvaluacionModal';
import Swal from 'sweetalert2';
import EditEvaluacionModal from '../EventosRecinto/Evaluacion/EditEvaluacionModal';
import '../../../../css/eventorecinto.css';
import axios from 'axios';
import ViewEvaluacionModal from '../EventosRecinto/Evaluacion/ViewEvaluacionModal';
import ViewModificacionModal from './Modificacion/ViewModificacionModal';
import AddModificacionModal from './Modificacion/AddModificacionModal';
import EditModificacionModal from './Modificacion/EditModificacionModal';
import { AuthContext } from '../../../../../context/AuthContext';



const EventoRecinto = ({ cambiarSeccion }) => {
  const navigate = useNavigate();
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false);
  const [showModificacionModal, setShowModificacionModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventType, setEventType] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    eventType: '',
    startDate: '',
    endDate: '',
  });
  const [showLow, setShowLow] = useState(false);
  const [showEditEvaluacionModal, setShowEditEvaluacionModal] = useState(false);
  const [showEditModificacionModal, setShowEditModificacionModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [recintos, setRecintos] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showViewEvaluacionModal, setShowViewEvaluacionModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showViewModificacionModal, setShowViewModificacionModal] = useState(false);
  const [selectedModificacion, setSelectedModificacion] = useState(null);
  const { user } = useContext(AuthContext);

  const eventTypeOptions = [
    { value: 'evaluacion', label: 'Evaluación' },
    { value: 'modificacion', label: 'Modificación' }
  ];


  const fetchEvents = useCallback(async () => {
    if (!eventType) return;
    
    setIsLoading(true);
    try {
      const url = eventType === 'evaluacion' 
        ? `${import.meta.env.VITE_API_USUARIO}evaluacion-recinto`
        : `${import.meta.env.VITE_API_USUARIO}modificacion-recinto`;
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
  }, [eventType]);

  useEffect(() => {
    if (eventType) {
      fetchEvents();
    }
  }, [eventType, fetchEvents]);

  const handleAddEvaluacion = async (newEvaluacion) => {
    await fetchEvents();
    setShowEvaluacionModal(false);
  };

  const handleAddModificacion = async (newModificacion) => {
    await fetchEvents();
    setShowModificacionModal(false);
  };

  const handleEditSubmit = async (updatedEvent) => {
    await fetchEvents();
    setShowEditEvaluacionModal(false);
    setShowEditModificacionModal(false);
  };

  const toggleEventStatus = async (event) => {
    const newStatus = event.status === 'Alta' ? 'Baja' : 'Alta';
    
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres cambiar el estado del evento a ${newStatus}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
      });
  
      if (result.isConfirmed) {
        const action = newStatus === 'Baja' ? 'dar-de-baja' : 'dar-de-alta';
        const url = `${import.meta.env.VITE_API_USUARIO}${eventType === 'evaluacion' ? 'evaluacion-recinto' : 'modificacion-recinto'}/${event.id}/${action}`;
  
        await axios.patch(url);
  
        await Swal.fire(
          '¡Cambiado!',
          `El estado del evento ha sido cambiado a ${newStatus}.`,
          'success'
        );

        await fetchEvents();
      }
    } catch (error) {
      console.error('Error al cambiar el estado del evento:', error);
      await Swal.fire('Error', 'No se pudo cambiar el estado del evento', 'error');
    }
  };

  const deleteEvent = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer. El evento será eliminado permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
  
      if (result.isConfirmed) {
        const url = eventType === 'evaluacion'
          ? `${import.meta.env.VITE_API_USUARIO}evaluacion-recinto/${id}`
          : `${import.meta.env.VITE_API_USUARIO}modificacion-recinto/${id}`;
  
        await axios.delete(url);
  
        await Swal.fire(
          '¡Eliminado!',
          'El evento ha sido eliminado.',
          'success'
        );

        await fetchEvents();
      }
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      await Swal.fire('Error', 'No se pudo eliminar el evento', 'error');
    }
  };

  const transformEventData = (event) => {
    const commonFields = {
      id: event._id,
      recinto: event.nombreRecinto, 
      status: event.activo ? 'Alta' : 'Baja',
      observaciones: event.observaciones,
      realizadoPor: event.realizadoPor,
    };
  
    if (eventType === 'evaluacion') {
      return {
        ...commonFields,
        type: 'Evaluación',
        date: new Date(event.fechaEvaluacion).toLocaleDateString('es-ES', { timeZone: 'UTC' }),
        descripcion: event.descripcion,
        condicionesAmbientales: event.condicionesAmbientales,
        condicionesBioseguridad: event.condicionesBioseguridad,
        calidadDidactica: event.calidadDidactica,
      };
    } else {
      return {
        ...commonFields,
        type: 'Modificación',
        date: new Date(event.creadoEn).toLocaleDateString('es-ES', { timeZone: 'UTC' }),
        descripcion: event.camposModificados.map(cm => `${cm.campo}: ${cm.nuevoValor}`).join(', '),
      };
    }
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
         event.recinto.toLowerCase().includes(filters.keyword.toLowerCase())) &&
        (!filters.eventType || event.type === filters.eventType) &&
        (!filters.startDate || new Date(event.date) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(event.date) <= new Date(filters.endDate)) &&
        (showLow || event.status !== 'Baja')
      );
    });
  }, [filters, showLow, events]);

  

  const handleAnimalesClick = () => {
    cambiarSeccion('eventoAnimal');
  };

  const darkGreenButtonStyle = {
    color: '#2C5E1A'
  };

  const disabledButtonStyle = {
    color: '#A0A0A0',
    cursor: 'not-allowed'
  };

  const handleEditClick = (event) => {
    setCurrentEvent(event);
    if (event.type === 'Evaluación') {
      setSelectedEventId(event.id);
      setShowEditEvaluacionModal(true);
    } else if (event.type === 'Modificación') {
      setSelectedEventId(event.id);
      setShowEditModificacionModal(true);
    }
  };
  

  const handleViewClick = (event) => {
    if (eventType === 'modificacion') {
      setSelectedModificacion(event.id); // Cambiamos esto para pasar solo el ID
      setShowViewModificacionModal(true);
    } else {
      setSelectedEventId(event.id);
      setShowViewEvaluacionModal(true);
    }
  };
  
  const handleCloseViewModal = () => {
    setShowViewEvaluacionModal(false);
    setSelectedEventId(null);  // Resetear el ID seleccionado al cerrar el modal
  };
  

  const renderActionButtons = (event) => {
    const viewButton = (
      <Button 
        variant="link" 
        style={darkGreenButtonStyle} 
        className="me-2"
        onClick={() => handleViewClick(event)}
      >
        <Eye size={18} />
      </Button>
    );

    if (user?.rol === "Guardafauna") {
      return (
        <>
          {viewButton}
          {event.realizadoPor === user._id && (
            <Button 
              variant="link" 
              style={darkGreenButtonStyle} 
              className="me-2"
              onClick={() => handleEditClick(event)}
            >
              <Pencil size={18} />
            </Button>
          )}
        </>
      );
    }

    return (
      <>
        {viewButton}
        <Button 
          variant="link" 
          style={darkGreenButtonStyle} 
          className="me-2"
          onClick={() => handleEditClick(event)}
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión Eventos de Recintos</h2>
        <div className="section-buttons">
          <Button variant="outline-success" style={{borderColor: '#70AA68', color: '#70AA68'}} className="me-2 mb-2 section-button" onClick={handleAnimalesClick}>Animales</Button>
          <Button variant="success" className="mb-2 section-button" style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}>Recintos</Button>
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

      {eventType && !isLoading && (
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
          <Form.Check 
            type="switch" 
            id="custom-switch" 
            label="Mostrar Bajas" 
            checked={showLow}
            onChange={(e) => setShowLow(e.target.checked)}
          />
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{backgroundColor: '#70AA68', borderColor: '#70AA68'}}>
              Nuevo Evento
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowEvaluacionModal(true)}>Evaluación</Dropdown.Item>
              <Dropdown.Item onClick={() => setShowModificacionModal(true)}>Modificación</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Form>
      
      <div className="table-responsive">
        <Table striped bordered hover className='text-center'>
          <thead>
            <tr className="table-header" style={{backgroundColor: '#70AA68', color: 'white'}}>
              <th>Tipo de Evento</th>
              <th>Recinto</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <tr key={event.id}>
                  <td>{event.type}</td>
                  <td>{event.recinto}</td>
                  <td>{event.date}</td>
                  <td>{event.status}</td>
                  <td>
                    {renderActionButtons(event)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No hay eventos para mostrar</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      </>
      )}
      {isLoading && <p>Cargando...</p>}
      {!eventType && !isLoading && (
        <p>Por favor, seleccione un tipo de evento para ver los datos.</p>
      )}
      <AddEvaluacionModal 
        show={showEvaluacionModal}
        handleClose={() => setShowEvaluacionModal(false)}
        handleAdd={handleAddEvaluacion}
      />
       <EditEvaluacionModal
      show={showEditEvaluacionModal}
      onHide={() => setShowEditEvaluacionModal(false)}
      eventId={selectedEventId} // Pasa el ID del evento en lugar del objeto completo
      onSubmit={handleEditSubmit}
    />
     <ViewEvaluacionModal
      show={showViewEvaluacionModal}
      onHide={handleCloseViewModal}
      eventId={selectedEventId}
    />
      {/* Eliminar este componente */}
      {/* <AddModificacionModal 
      show={showModificacionModal} 
      onHide={() => setShowModificacionModal(false)} 
      handleAdd={handleAddModificacion}
      /> */}
      {/*
      <EditAddModificacionModal
        show={showEditModificacionModal}
        onHide={() => setShowEditModificacionModal(false)}
        event={currentEvent}
        onSubmit={handleEditSubmit}
      /> */}
      <ViewModificacionModal
        show={showViewModificacionModal}
        onHide={() => setShowViewModificacionModal(false)}
        modificacionId={selectedModificacion}
      />
      <AddModificacionModal 
        show={showModificacionModal}
        handleClose={() => setShowModificacionModal(false)}
        handleAdd={handleAddModificacion}
      />
      <EditModificacionModal
        show={showEditModificacionModal}
        onHide={() => setShowEditModificacionModal(false)}
        eventId={selectedEventId}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default EventoRecinto;