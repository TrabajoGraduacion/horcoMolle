import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { AuthContext } from '../../../../../../context/AuthContext';
import AddRevisionMedicaModal from './RevisionMedica/AddRevisionMedicaModal';
import AddAnestesiaModal from './Anestesia/AddAnestesiaModal';
import AddMetodoComplementarioModal from './MetodoComplementario/AddMetodoComplementarioModal';
import AddDiagnosticoModal from './Diagnostico/AddDiagnosticoModal';
import AddTratamientoModal from './Tratamiento/AddTratamientoModal';
import AddEvolucionModal from './Evolucion/AddEvolucionModal';
import AddOdontogramaModal from './Odontograma/AddOdontogramaModal';
import AddNecropsiaModal from './Necropsia/AddNecropsiaModal';
import AddMedidaMorfologicaModal from './MedidaMorfologica/AddMedidaMorfologicaModal';
import { FichaClinicaContext } from '../../../../../../context/FichaClinicaContext';
import EditEvolucionModal from './Evolucion/EditEvolucionModal';
import EditDiagnosticoModal from './Diagnostico/EditDiagnosticoModal';
import EditTratamientoModal from './Tratamiento/EditTratamientoModal';
import EditMetodoComplementarioModal from './MetodoComplementario/EditMetodoComplementarioModal';
import EditMedidaMorfologicaModal from './MedidaMorfologica/EditMedidaMorfologicaModal';
import ViewAnestesiaModal from './Anestesia/ViewAnestesiaModal';
import { Eye } from 'lucide-react';

const AddFichaClinicaModal = ({ show, handleClose, handleAdd }) => {
  const { user } = useContext(AuthContext);
  const { fichaClinicaActual, setFichaClinicaActual } = useContext(FichaClinicaContext);
  
  const [animales, setAnimales] = useState([]);
  const [fichaClinicaId, setFichaClinicaId] = useState(null);
  const [fichaClinicaCreada, setFichaClinicaCreada] = useState(false);
  const [showFichaClinica, setShowFichaClinica] = useState(show);
  
  // Estados para mostrar/ocultar modales
  const [showRevisionMedica, setShowRevisionMedica] = useState(false);
  const [showAnestesia, setShowAnestesia] = useState(false);
  const [showMetodoComplementario, setShowMetodoComplementario] = useState(false);
  const [showDiagnostico, setShowDiagnostico] = useState(false);
  const [showTratamiento, setShowTratamiento] = useState(false);
  const [showEvolucion, setShowEvolucion] = useState(false);
  const [showOdontograma, setShowOdontograma] = useState(false);
  const [showNecropsia, setShowNecropsia] = useState(false);
  const [showMedidasMorfologicas, setShowMedidasMorfologicas] = useState(false);
  const [showViewAnestesia, setShowViewAnestesia] = useState(false);
  const [selectedAnestesiaId, setSelectedAnestesiaId] = useState(null);

  // Estado para la ficha clínica
  const [fichaClinica, setFichaClinica] = useState({
    animalId: '',
    motivo: '',
    observaciones: '',
    creadoPor: user ? user._id : '',
    activo: true
  });

  const [eventosCreados, setEventosCreados] = useState([]);
  const [selectedEventoId, setSelectedEventoId] = useState(null);

  const handleEventoCreado = (tipo, data) => {
    console.log('handleEventoCreado llamado con:', { tipo, data });
    console.log('Estructura completa de data:', JSON.stringify(data, null, 2));

    setEventosCreados(prev => {
      const newEventos = [
        ...prev,
        {
          tipo: tipo,
          datos: {
            _id: data._id,
            ...data
          }
        }
      ];
      console.log('Estructura de eventosCreados actualizada:', JSON.stringify(newEventos, null, 2));
      return newEventos;
    });
  };

  // Mover eventosMap fuera de las funciones
  const eventosMap = {
    'Revisión Médica': {
      campo: 'revisionMedicaId',
      api: 'revision-medica'
    },
    'Anestesia': {
      campo: 'anestesiaId',
      api: 'anestesia'
    },
    'Método Complementario': {
      campo: 'metodoComplementarioId',
      api: 'examen-complementario'
    },
    'Diagnóstico': {
      campo: 'diagnosticoId',
      api: 'diagnostico'
    },
    'Tratamiento': {
      campo: 'tratamientoId',
      api: 'tratamiento'
    },
    'Evolución': {
      campo: 'evolucionId',
      api: 'evolucion'
    },
    'Odontograma': {
      campo: 'odontogramaId',
      api: 'odontograma'
    },
    'Necropsia': {
      campo: 'necropsiaId',
      api: 'necropsia'
    },
    'Medidas Morfológicas': {
      campo: 'medidasMorfologicasId',
      api: 'medidas-morfologicas'
    }
  };

  const handleEliminarEvento = async (tipoEvento, eventoId) => {
    try {
      const fichaClinicaId = localStorage.getItem('fichaClinicaId');
      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró la ficha clínica activa', 'error');
        return;
      }

      console.log('Intentando eliminar evento:', {
        tipoEvento,
        eventoId,
        fichaClinicaId
      });

      const fichaClinicaResponse = await axios.get(
        `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`
      );

      const result = await Swal.fire({
        title: '¿Está seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const eventoInfo = eventosMap[tipoEvento];
        if (!eventoInfo) {
          throw new Error(`Tipo de evento no reconocido: ${tipoEvento}`);
        }

        // Obtener el ID del evento desde la ficha clínica
        const eventoIdEnFicha = fichaClinicaResponse.data[eventoInfo.campo];

        if (!eventoIdEnFicha) {
          throw new Error('No se encontró el ID del evento en la ficha clínica');
        }

        // 1. Actualizar la ficha clínica
        const updateData = { [eventoInfo.campo]: null };
        await axios.put(
          `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`,
          updateData
        );

        // 2. Eliminar el evento usando el ID de la ficha clínica
        await axios.delete(`${import.meta.env.VITE_API_USUARIO}${eventoInfo.api}/${eventoIdEnFicha}`);
        
        // 3. Actualizar la lista de eventos y localStorage
        const nuevosEventos = eventosCreados.filter(evento => evento.id !== eventoId);
        setEventosCreados(nuevosEventos);
        localStorage.setItem('eventosCreados', JSON.stringify(nuevosEventos));
        
        Swal.fire('Eliminado', 'El evento ha sido eliminado', 'success');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      Swal.fire('Error', 'No se pudo eliminar el evento', 'error');
    }
  };

  const handleEditarEvento = async (tipoEvento, eventoId) => {
    console.log('Iniciando edición:', { tipoEvento, eventoId });
    
    try {
      const fichaClinicaId = localStorage.getItem('fichaClinicaId');
      console.log('FichaClinicaId del localStorage:', fichaClinicaId);
      
      if (!fichaClinicaId) {
        Swal.fire('Error', 'No se encontró la ficha clínica activa', 'error');
        return;
      }

      const fichaClinicaResponse = await axios.get(
        `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`
      );
      console.log('Ficha clínica obtenida:', fichaClinicaResponse.data);

      const eventoInfo = eventosMap[tipoEvento];
      console.log('Información del evento:', { tipoEvento, eventoInfo });
      
      if (!eventoInfo) {
        console.error('Tipo de evento no reconocido:', tipoEvento);
        return;
      }

      // Obtener el ID del evento desde la ficha clínica
      const eventoIdEnFicha = fichaClinicaResponse.data[eventoInfo.campo];
      console.log('ID del evento en ficha:', eventoIdEnFicha);

      if (!eventoIdEnFicha) {
        throw new Error('No se encontró el ID del evento en la ficha clínica');
      }

      eventoId = eventoIdEnFicha;

      // Antes del switch
      console.log('Preparando para abrir modal de edición:', {
        tipoEvento,
        eventoId,
        eventoIdEnFicha
      });

      // Manejar la edición según el tipo de evento
      switch (tipoEvento) {
        case 'Evolución':
          setEventoAEditar(eventoId);
          setShowEditEvolucion(true);
          setShowFichaClinica(false);
          break;
        case 'Revisión Médica':
          setEventoAEditar(eventoId);
          setShowEditRevisionMedica(true);
          setShowFichaClinica(false);
          break;
        case 'Anestesia':
          setEventoAEditar(eventoId);
          setShowEditAnestesia(true);
          setShowFichaClinica(false);
          break;
        case 'Método Complementario':
          setEventoAEditar(eventoId);
          setShowEditMetodoComplementario(true);
          setShowFichaClinica(false);
          break;
        case 'Diagnóstico':
          setEventoAEditar(eventoId);
          setShowEditDiagnostico(true);
          setShowFichaClinica(false);
          break;
        case 'Tratamiento':
          setEventoAEditar(eventoId);
          setShowEditTratamiento(true);
          setShowFichaClinica(false);
          break;
        case 'Odontograma':
          setEventoAEditar(eventoId);
          setShowEditOdontograma(true);
          setShowFichaClinica(false);
          break;
        case 'Necropsia':
          setEventoAEditar(eventoId);
          setShowEditNecropsia(true);
          setShowFichaClinica(false);
          break;
        case 'Medidas Morfológicas':
          setEventoAEditar(eventoId);
          setShowEditMedidaMorfologica(true);
          setShowFichaClinica(false);
          break;
        default:
          console.error('Tipo de evento no manejado:', tipoEvento);
      }

    } catch (error) {
      console.error('Error completo al editar evento:', error);
      Swal.fire('Error', 'No se pudo editar el evento', 'error');
    }
  };

  const handleModalClose = () => {
    setFichaClinica({
      animalId: '',
      motivo: '',
      observaciones: '',
      creadoPor: user ? user._id : '',
      activo: true
    });
    setFichaClinicaCreada(false);
    setFichaClinicaId(null);
    setEventosCreados([]);
    
    // Limpiar localStorage
    localStorage.removeItem('fichaClinicaId');
    localStorage.removeItem('fichaClinicaCreada');
    localStorage.removeItem('fichaClinicaData');
    localStorage.removeItem('eventosCreados');
    
    handleClose();
  };

  useEffect(() => {
    setShowFichaClinica(show);
  }, [show]);

  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}animales`);
        const opcionesAnimales = response.data.map(animal => ({
          value: animal._id,
          label: `${animal.nombreVulgar} - ${animal.nombreInstitucional}`
        }));
        setAnimales(opcionesAnimales);
      } catch (error) {
        console.error('Error al obtener los animales:', error);
      }
    };
    fetchAnimales();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFichaClinica(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAnimalChange = (selectedOption) => {
    setFichaClinica(prev => ({
      ...prev,
      animalId: selectedOption.value
    }));
  };

  const handleTipoEventoChange = (e) => {
    if (!fichaClinicaCreada) {
      Swal.fire({
        title: 'Error',
        text: 'Primero debe crear la ficha clínica antes de agregar eventos',
        icon: 'warning'
      });
      return;
    }

    const tipo = e.target.value;
    
    // Mapeo de valores del select a tipos de evento
    const tipoEventoMap = {
      'revisionMedica': 'Revisión Médica',
      'anestesia': 'Anestesia',
      'metodoComplementario': 'Método Complementario',
      'diagnostico': 'Diagnóstico',
      'tratamiento': 'Tratamiento',
      'evolucion': 'Evolución',
      'odontograma': 'Odontograma',
      'necropsia': 'Necropsia',
      'medidasMorfologicas': 'Medidas Morfológicas',
    };

    // Verificar si ya existe un evento de este tipo
    const tipoEvento = tipoEventoMap[tipo];
    const eventoExistente = eventosCreados.find(evento => evento.tipo === tipoEvento);

    if (eventoExistente) {
      Swal.fire({
        title: 'Error',
        text: `Ya existe un evento de tipo ${tipoEvento}. Solo se permite un evento por tipo.`,
        icon: 'warning'
      });
      return;
    }

    setShowFichaClinica(false);
    
    // Mostrar el modal correspondiente según el tipo seleccionado
    const modalSetters = {
      revisionMedica: setShowRevisionMedica,
      anestesia: setShowAnestesia,
      metodoComplementario: setShowMetodoComplementario,
      diagnostico: setShowDiagnostico,
      tratamiento: setShowTratamiento,
      evolucion: setShowEvolucion,
      odontograma: setShowOdontograma,
      necropsia: setShowNecropsia,
      medidasMorfologicas: setShowMedidasMorfologicas,
    };

    if (modalSetters[tipo]) {
      modalSetters[tipo](true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!fichaClinica.animalId || !fichaClinica.motivo) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor complete los campos requeridos (Animal y Motivo)',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#70AA68',
          allowEnterKey: true,
          customClass: {
            confirmButton: 'custom-swal-button'
          }
        });
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}fichaClinica`, 
        fichaClinica
      );

      if (response.status === 201) {
        const nuevaFichaId = response.data.fichaClinicaId;
        
        setFichaClinicaId(nuevaFichaId);
        localStorage.setItem('fichaClinicaId', nuevaFichaId);
        
        setFichaClinicaCreada(true);
        localStorage.setItem('fichaClinicaCreada', 'true');
        
        localStorage.setItem('fichaClinicaData', JSON.stringify({
          animalId: fichaClinica.animalId,
          motivo: fichaClinica.motivo,
          observaciones: fichaClinica.observaciones
        }));
        
        await Swal.fire({
          title: "¡Ficha clínica creada exitosamente!",
          text: "La nueva ficha clínica ha sido registrada en el sistema. Ahora puede agregar eventos.",
          icon: "success",
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#70AA68',
          allowEnterKey: true,
          customClass: {
            confirmButton: 'custom-swal-button'
          }
        });
        
        handleAdd(response.data);
      }
    } catch (error) {
      Swal.fire({
        title: "Error en el registro",
        text: error.response?.data?.message || "Hubo un problema al crear la ficha clnica. Por favor, inténtelo nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: '#70AA68',
        allowEnterKey: true,
        customClass: {
          confirmButton: 'custom-swal-button'
        }
      });
    }
  };

  const handleCloseEvento = (setShowEvento) => {
    setShowEvento(false);
    setShowFichaClinica(true);
  };


  useEffect(() => {
    
  }, [fichaClinicaActual]);

  useEffect(() => {
    const savedFichaId = localStorage.getItem('fichaClinicaId');
    const savedFichaCreada = localStorage.getItem('fichaClinicaCreada');
    const savedFichaData = localStorage.getItem('fichaClinicaData');
    const savedEventos = localStorage.getItem('eventosCreados');

    if (savedFichaId && savedFichaCreada === 'true') {
      setFichaClinicaId(savedFichaId);
      setFichaClinicaCreada(true);
      if (savedFichaData) {
        setFichaClinica(prev => ({
          ...prev,
          ...JSON.parse(savedFichaData)
        }));
      }
      if (savedEventos) {
        setEventosCreados(JSON.parse(savedEventos));
      }
    }
  }, []);

  const [showEditDiagnostico, setShowEditDiagnostico] = useState(false);
  const [eventoAEditar, setEventoAEditar] = useState(null);

  // Estados para modales de edición
  const [showEditEvolucion, setShowEditEvolucion] = useState(false);
  const [showEditRevisionMedica, setShowEditRevisionMedica] = useState(false);
  const [showEditAnestesia, setShowEditAnestesia] = useState(false);
  const [showEditMetodoComplementario, setShowEditMetodoComplementario] = useState(false);
  const [showEditTratamiento, setShowEditTratamiento] = useState(false);
  const [showEditOdontograma, setShowEditOdontograma] = useState(false);
  const [showEditNecropsia, setShowEditNecropsia] = useState(false);
  const [showEditMedidaMorfologica, setShowEditMedidaMorfologica] = useState(false);

  // Agregar estilos comunes
  const labelStyle = {
    color: '#333333',
    fontWeight: '500'
  };

  const inputStyle = {
    backgroundColor: '#D9EAD3',
    border: 'none', 
    borderRadius: '4px',
    padding: '10px'
  };

  const handleVerEvento = (tipo, eventoId) => {
    console.log('handleVerEvento llamado con:', { tipo, eventoId });
    console.log('Estado actual de eventosCreados:', JSON.stringify(eventosCreados, null, 2));

    // Encontrar el evento específico
    const evento = eventosCreados.find(e => e.tipo === tipo);
    const anestesiaId = evento?.datos?.anestesia?._id;
    
    console.log('ID de anestesia encontrado:', anestesiaId);

    if (!anestesiaId) {
      console.error('Error: No se encontró el ID de anestesia');
      Swal.fire({
        title: 'Error',
        text: 'No se puede visualizar el evento en este momento',
        icon: 'error',
        confirmButtonColor: '#70AA68',
      });
      return;
    }

    setSelectedEventoId(anestesiaId);
    console.log('selectedEventoId establecido a:', anestesiaId);

    switch (tipo) {
      case 'Anestesia':
        console.log('Mostrando modal de anestesia para ID:', anestesiaId);
        setShowViewAnestesia(true);
        setShowFichaClinica(false);
        break;
      default:
        console.log('Tipo de evento no manejado:', tipo);
    }
  };

  return (
    <>
      <Modal show={showFichaClinica} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Ficha Clínica</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#ffffff', padding: '25px' }}>
          <Form onSubmit={handleSubmit}>
            {!fichaClinicaCreada && (
              <div className="alert alert-info" role="alert" style={{
                backgroundColor: '#EBF8FF',
                border: '1px solid #BEE3F8',
                borderRadius: '8px',
                color: '#2C5282'
              }}>
                <i className="fas fa-info-circle me-2"></i>
                Debe guardar los datos básicos de la ficha clínica antes de poder agregar eventos
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>Animal</Form.Label>
              <Select
                value={animales.find(a => a.value === fichaClinica.animalId)}
                onChange={handleAnimalChange}
                options={animales}
                isDisabled={fichaClinicaCreada}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#D9EAD3',
                    border: 'none',
                    boxShadow: 'none'
                  })
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>Motivo</Form.Label>
              <Form.Control
                type="text"
                name="motivo"
                value={fichaClinica.motivo}
                onChange={handleInputChange}
                disabled={fichaClinicaCreada}
                required
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={labelStyle}>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                name="observaciones"
                value={fichaClinica.observaciones}
                onChange={handleInputChange}
                disabled={fichaClinicaCreada}
                style={inputStyle}
              />
            </Form.Group>

            {fichaClinicaCreada && (
              <>
                {eventosCreados.length > 0 && (
                  <div className="mb-3">
                    <h6 style={{ 
                      color: '#333333',
                      fontWeight: '500',
                      marginBottom: '15px'
                    }}>Eventos Clínicos Agregados:</h6>
                    <div className="list-group">
                      {eventosCreados.map((evento, index) => {
                        console.log('Renderizando evento:', evento);
                        console.log('ID del evento:', evento.datos?._id);
                        
                        return (
                          <div key={index} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <strong>{evento.tipo}</strong>
                              </div>
                              <div className="btn-group">
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleVerEvento(evento.tipo, evento.datos?.anestesia?._id)}
                                  style={{
                                    borderColor: '#70AA68',
                                    color: '#70AA68',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f7ef';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <Eye size={16} />
                                  Ver
                                </Button>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleEditarEvento(evento.tipo, evento.datos._id)}
                                  style={{
                                    borderColor: '#70AA68',
                                    color: '#70AA68',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f7ef';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <i className="fas fa-edit"></i>
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleEliminarEvento(evento.tipo, evento.datos._id)}
                                  style={{
                                    borderColor: '#70AA68',
                                    color: '#70AA68',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f7ef';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Agregar Evento Clínico</Form.Label>
                  <Form.Select 
                    onChange={handleTipoEventoChange}
                    style={{
                      backgroundColor: '#D9EAD3',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '10px',
                      color: '#333333',
                      cursor: 'pointer',
                      boxShadow: 'none',
                      fontWeight: '400',
                      transition: 'all 0.3s ease'
                    }}
                    className="custom-select"
                  >
                    <option value="">
                      <i className="fas fa-plus-circle"></i> Seleccione un tipo de evento clínico
                    </option>
                    <option value="revisionMedica">Revisión Médica
                    </option>
                    <option value="anestesia">Anestesia</option>
                    <option value="metodoComplementario">Método Complementario</option>
                    <option value="diagnostico">Diagnóstico</option>
                    <option value="tratamiento">Tratamiento</option>
                    <option value="evolucion">Evolución</option>
                    <option value="odontograma">Odontograma</option>
                    <option value="necropsia">Necropsia</option>
                    <option value="medidasMorfologicas">Medidas Morfológicas</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ 
          padding: '15px 25px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #dee2e6'
        }}>
          <div className="d-flex justify-content-between w-100">
            {!fichaClinicaCreada && (
              <>
                <Button 
                  variant="outline-danger" 
                  onClick={handleModalClose}
                  style={{
                    backgroundColor: 'white',
                    borderColor: '#dc3545',
                    color: '#dc3545',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff1f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <i className="fas fa-times"></i> Cancelar
                </Button>

                <Button 
                  variant="success" 
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: '#70AA68',
                    borderColor: '#70AA68',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5C8F55';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#70AA68';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Guardar 
                </Button>
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      {/* Modales de eventos */}
      <AddRevisionMedicaModal 
        show={showRevisionMedica}
        handleClose={() => handleCloseEvento(setShowRevisionMedica)}
        animalId={fichaClinica.animalId}
        fichaClinicaId={fichaClinicaId}
        user={user}
      />

      <AddAnestesiaModal 
        show={showAnestesia}
        handleClose={() => handleCloseEvento(setShowAnestesia)}
        animalId={fichaClinica.animalId}
        fichaClinicaId={fichaClinicaId}
        user={user}
        onEventoCreado={(data) => {
          console.log('Evento creado:', data);
          console.log('ID del evento creado:', data._id);
          console.log('Estructura completa del evento:', JSON.stringify(data, null, 2));
          
          setEventosCreados(prev => {
            const newEventos = [
              ...prev,
              {
                tipo: 'Anestesia',
                datos: {
                  _id: data._id,
                  ...data
                }
              }
            ];
            console.log('Nuevo estado de eventosCreados:', JSON.stringify(newEventos, null, 2));
            localStorage.setItem('eventosCreados', JSON.stringify(newEventos));
            return newEventos;
          });
          handleCloseEvento(setShowAnestesia);
        }}
      />

      <AddMetodoComplementarioModal 
        show={showMetodoComplementario}
        handleClose={() => handleCloseEvento(setShowMetodoComplementario)}
        animalId={fichaClinica.animalId}
        fichaClinicaId={fichaClinicaId}
        user={user}
        onEventoCreado={(data) => {
          setEventosCreados(prev => [
            ...prev,
            {
              tipo: 'Método Complementario',
              id: data._id,
              fecha: data.fecha,
              datos: data
            }
          ]);
          localStorage.setItem('eventosCreados', JSON.stringify([
            ...eventosCreados,
            {
              tipo: 'Método Complementario',
              id: data._id,
              fecha: data.fecha,
              datos: data
            }
          ]));
          handleCloseEvento(setShowMetodoComplementario);
        }}
      />

      <AddDiagnosticoModal 
        show={showDiagnostico}
        handleClose={() => handleCloseEvento(setShowDiagnostico)}
        animalId={fichaClinica.animalId}
        fichaClinicaId={fichaClinicaId}
        user={user}
        onEventoCreado={(data) => handleEventoCreado('Diagnóstico', data)}
      />

      <AddTratamientoModal 
        show={showTratamiento}
        handleClose={() => handleCloseEvento(setShowTratamiento)}
        animalId={fichaClinica.animalId}
        fichaClinicaId={fichaClinicaId}
        user={user}
        onEventoCreado={(data) => {
          setEventosCreados(prev => [
            ...prev,
            {
              tipo: 'Tratamiento',
              datos: data,
              fecha: data.fecha
            }
          ]);
          localStorage.setItem('eventosCreados', JSON.stringify([
            ...eventosCreados,
            {
              tipo: 'Tratamiento',
              datos: data,
              fecha: data.fecha
            }
          ]));
          handleCloseEvento(setShowTratamiento);
        }}
      />

      <AddEvolucionModal 
        show={showEvolucion}
        handleClose={() => handleCloseEvento(setShowEvolucion)}
        animalId={fichaClinica.animalId}
        fichaClinicaId={fichaClinicaId}
        user={user}
        onEventoCreado={(data) => handleEventoCreado('Evolución', data)}
      />

      <AddOdontogramaModal 
        show={showOdontograma}
        handleClose={() => handleCloseEvento(setShowOdontograma)}
        animalId={fichaClinica.animalId}
        fichaClinicaId={fichaClinicaId}
        user={user}
      />

      <AddNecropsiaModal 
        show={showNecropsia}
        handleClose={() => handleCloseEvento(setShowNecropsia)}
        animalId={fichaClinica.animalId}
        fichaClinicaId={fichaClinicaId}
        user={user}
      />

      <AddMedidaMorfologicaModal 
        show={showMedidasMorfologicas}
        handleClose={() => handleCloseEvento(setShowMedidasMorfologicas)}
        animalId={fichaClinica.animalId}
        fichaClinicaId={fichaClinicaId}
        user={user}
        onEventoCreado={(data) => {
          setEventosCreados(prev => [
            ...prev,
            {
              tipo: 'Medidas Morfológicas',
              id: data._id,
              fecha: data.fecha,
              datos: data
            }
          ]);
          localStorage.setItem('eventosCreados', JSON.stringify([
            ...eventosCreados,
            {
              tipo: 'Medidas Morfológicas',
              id: data._id,
              fecha: data.fecha,
              datos: data
            }
          ]));
          handleCloseEvento(setShowMedidasMorfologicas);
        }}
      />

      <EditEvolucionModal 
        show={showEditEvolucion}
        handleClose={() => {
          setShowEditEvolucion(false);
          setEventoAEditar(null);
          setShowFichaClinica(true);
        }}
        eventoId={eventoAEditar}
        animalId={fichaClinica.animalId}
        user={user}
        onEventoActualizado={(data) => {
          setEventosCreados(prev => 
            prev.map(evento => 
              evento.id === data._id 
                ? { ...evento, ...data }
                : evento
            )
          );
          localStorage.setItem('eventosCreados', JSON.stringify(
            eventosCreados.map(evento => 
              evento.id === data._id 
                ? { ...evento, ...data }
                : evento
            )
          ));
        }}
      />

      <EditDiagnosticoModal
        show={showEditDiagnostico}
        handleClose={() => {
          setShowEditDiagnostico(false);
          setEventoAEditar(null);
          setShowFichaClinica(true);
        }}
        eventoId={eventoAEditar}
        animalId={fichaClinica.animalId}
        user={user}
        onEventoActualizado={(data) => {
          setEventosCreados(prev =>
            prev.map(evento =>
              evento.tipo === 'Diagnóstico'
                ? { 
                    ...evento, 
                    datos: data,
                    fecha: data.fecha 
                  }
                : evento
            )
          );
          localStorage.setItem('eventosCreados', JSON.stringify(
            eventosCreados.map(evento =>
              evento.tipo === 'Diagnóstico'
                ? { 
                    ...evento, 
                    datos: data,
                    fecha: data.fecha 
                  }
                : evento
            )
          ));
        }}
      />

      <EditTratamientoModal
        show={showEditTratamiento}
        handleClose={() => {
          setShowEditTratamiento(false);
          setEventoAEditar(null);
          setShowFichaClinica(true);
        }}
        eventoId={eventoAEditar}
        animalId={fichaClinica.animalId}
        user={user}
        onEventoActualizado={(data) => {
          setEventosCreados(prev =>
            prev.map(evento =>
              evento.tipo === 'Tratamiento'
                ? { 
                    ...evento, 
                    datos: data,
                    fecha: data.fecha 
                  }
                : evento
            )
          );
          localStorage.setItem('eventosCreados', JSON.stringify(
            eventosCreados.map(evento =>
              evento.tipo === 'Tratamiento'
                ? { 
                    ...evento, 
                    datos: data,
                    fecha: data.fecha 
                  }
                : evento
            )
          ));
        }}
      />

      <EditMetodoComplementarioModal
        show={showEditMetodoComplementario}
        handleClose={() => {
          setShowEditMetodoComplementario(false);
          setEventoAEditar(null);
          setShowFichaClinica(true);
        }}
        eventoId={eventoAEditar}
        animalId={fichaClinica.animalId}
        user={user}
        onEventoActualizado={(data) => {
          setEventosCreados(prev =>
            prev.map(evento =>
              evento.tipo === 'Método Complementario'
                ? { 
                    ...evento, 
                    datos: data,
                    fecha: data.fecha 
                  }
                : evento
            )
          );
          localStorage.setItem('eventosCreados', JSON.stringify(
            eventosCreados.map(evento =>
              evento.tipo === 'Método Complementario'
                ? { 
                    ...evento, 
                    datos: data,
                    fecha: data.fecha 
                  }
                : evento
            )
          ));
        }}
      />

      <EditMedidaMorfologicaModal
        show={showEditMedidaMorfologica}
        handleClose={() => {
          setShowEditMedidaMorfologica(false);
          setEventoAEditar(null);
          setShowFichaClinica(true);
        }}
        eventoId={eventoAEditar}
        animalId={fichaClinica.animalId}
        user={user}
        onEventoActualizado={(data) => {
          setEventosCreados(prev =>
            prev.map(evento =>
              evento.tipo === 'Medidas Morfológicas'
                ? { 
                    ...evento, 
                    datos: data,
                    fecha: data.fecha 
                  }
                : evento
            )
          );
          localStorage.setItem('eventosCreados', JSON.stringify(
            eventosCreados.map(evento =>
              evento.tipo === 'Medidas Morfológicas'
                ? { 
                    ...evento, 
                    datos: data,
                    fecha: data.fecha 
                  }
                : evento
            )
          ));
        }}
      />

      <ViewAnestesiaModal
        show={showViewAnestesia}
        handleClose={() => {
          console.log('Cerrando modal de anestesia');
          setShowViewAnestesia(false);
          setSelectedEventoId(null);
          setShowFichaClinica(true);
        }}
        anestesiaId={selectedEventoId}
      />
    </>
  );
};

export default AddFichaClinicaModal;