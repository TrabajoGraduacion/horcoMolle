import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";
import "../../css/inicio.css";
import Hojita from "../views/offer/Hojita";
import Supplier from "../views/supplier/Supplier"; 
import Administrador from "../views/user/Administrador"; 
import Grafico from "./Graficos";
import Product from "../views/product/Product";
import EventoAnimal from "./Eventos/EventosAnimal/EventoAnimal";
import { Button, Card, Col, Container, Row, Modal, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import EventoRecinto from "./Eventos/EventosRecinto/EventoRecinto";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
//Modales Eventos 
import ViewProductModal from './product/ViewProductModal';
import ViewDietaModal from './Eventos/EventosAnimal/Dieta/ViewDietaModal';
import ViewEgresoModal from './Eventos/EventosAnimal/Egreso/ViewEgresoModal';
import ViewEnriquecimientoModal from './Eventos/EventosAnimal/Enriquecimiento/ViewEnriquecimientoModal';
import ViewObservacionDiariaModal from './Eventos/EventosAnimal/ObservacionDiaria/ViewObservacionDiariaModal';
import ViewRelocalizacionModal from './Eventos/EventosAnimal/Relocalizacion/ViewRelocalizacionModal';
import ViewEvaluacionModal from './Eventos/EventosRecinto/Evaluacion/ViewEvaluacionModal';
import ViewModificacionModal from './Eventos/EventosRecinto/Modificacion/ViewModificacionModal';
import ViewFichaClinicaModal from './Eventos/EventosAnimal/FichaClinica/ViewFichaClinicaModal';
import ViewMedidasMorfologicasModal from './Eventos/EventosAnimal/FichaClinica/MedidaMorfologica/ViewMedidaMorfologicaModal';
import ViewAnestesiaModal from './Eventos/EventosAnimal/FichaClinica/Anestesia/ViewAnestesiaModal';
import ViewEvolucionModal from './Eventos/EventosAnimal/FichaClinica/Evolucion/ViewEvolucionModal';
import ViewTratamientoModal from './Eventos/EventosAnimal/FichaClinica/Tratamiento/ViewTratamientoModal';
import ViewOdontogramaModal from './Eventos/EventosAnimal/FichaClinica/Odontograma/ViewOdontogramaModal';
import ViewNecropsiaModal from './Eventos/EventosAnimal/FichaClinica/Necropsia/ViewNecropsiaModal';
import ViewMetodoComplementarioModal from './Eventos/EventosAnimal/FichaClinica/MetodoComplementario/ViewMetodoComplementarioModal';
import ViewDiagnosticoModal from './Eventos/EventosAnimal/FichaClinica/Diagnostico/ViewDiagnosticoModal';
import ViewMedidaMorfologicaModal from './Eventos/EventosAnimal/FichaClinica/MedidaMorfologica/ViewMedidaMorfologicaModal';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';


const SeccionPrincipal = ({ setSeccion }) => {
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [tipoEventoSeleccionado, setTipoEventoSeleccionado] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}reportes/eventosAnimalRecinto`);
        const eventosConFecha = response.data
          .filter(evento => evento.fecha)
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 2);
        setEventos(eventosConFecha);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    fetchEventos();
  }, []);

  const handleVerMas = (evento) => {
    setSelectedEvento(evento);
    setModalType(evento.tipo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvento(null);
    setModalType(null);
  };

  const handleViewClick = (evento) => {
    setSelectedEvento(evento);
    setTipoEventoSeleccionado(evento.tipo);
    setShowViewModal(true);
  };

  const renderModal = () => {
    switch (modalType) {
      case 'Ingreso':
        return <ViewProductModal show={showModal} handleClose={handleCloseModal} animalId={selectedEvento.animalId} />;
      case 'Dieta':
        return <ViewDietaModal show={showModal} handleClose={handleCloseModal} dieta={selectedEvento} />;
      case 'Egreso':
        return <ViewEgresoModal show={showModal} handleClose={handleCloseModal} egreso={selectedEvento} />;
      case 'Enriquecimiento':
        return <ViewEnriquecimientoModal show={showModal} handleClose={handleCloseModal} enriquecimiento={selectedEvento} />;
      case 'ObservacionDiaria':
        return <ViewObservacionDiariaModal show={showModal} handleClose={handleCloseModal} observacion={selectedEvento} />;
      case 'Relocalizacion':
        return <ViewRelocalizacionModal show={showModal} handleClose={handleCloseModal} relocalizacion={selectedEvento} />;
      case 'Evaluacion':
        return <ViewEvaluacionModal show={showModal} onHide={handleCloseModal} eventId={selectedEvento.id} />;
      case 'Modificacion':
        return <ViewModificacionModal show={showModal} onHide={handleCloseModal} modificacionId={selectedEvento.id} />;
      default:
        return null;
    }
  };

  const renderViewModal = () => {
    const tipoNormalizado = tipoEventoSeleccionado
      ?.toLowerCase()
      .replace(/\s+/g, '')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    switch (tipoNormalizado) {
      case 'medidasmorfologicas':
        return (
          <ViewMedidaMorfologicaModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            medidaId={selectedEvento.id || selectedEvento._id}
          />
        );
      case 'evolucion':
        return (
          <ViewEvolucionModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            evolucionId={selectedEvento.id}
          />
        );
      case 'tratamiento':
        return (
          <ViewTratamientoModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            tratamientoId={selectedEvento.id}
          />
        );
      case 'odontograma':
        return (
          <ViewOdontogramaModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            odontograma={selectedEvento}
          />
        );
      case 'necropsia':
        return (
          <ViewNecropsiaModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            necropsia={selectedEvento}
          />
        );
      case 'metodoscomplementarios':
        return (
          <ViewMetodoComplementarioModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            metodoId={selectedEvento.id}
          />
        );
      case 'diagnostico':
        return (
          <ViewDiagnosticoModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            diagnosticoId={selectedEvento.id}
          />
        );
      case 'anestesia':
        return (
          <ViewAnestesiaModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            anestesiaId={selectedEvento.id}
          />
        );
      case 'dieta':
        return (
          <ViewDietaModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            dieta={selectedEvento}
          />
        );
      case 'egreso':
        return (
          <ViewEgresoModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            egreso={selectedEvento}
          />
        );
      case 'enriquecimiento':
        return (
          <ViewEnriquecimientoModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            enriquecimiento={selectedEvento}
          />
        );
      case 'observaciondiaria':
        return (
          <ViewObservacionDiariaModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            observacion={selectedEvento}
          />
        );
      case 'relocalizacion':
        return (
          <ViewRelocalizacionModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            relocalizacion={selectedEvento}
          />
        );
      case 'evaluacion':
        return (
          <ViewEvaluacionModal
            show={showViewModal}
            onHide={() => setShowViewModal(false)}
            eventId={selectedEvento.id}
          />
        );
      case 'modificacion':
        return (
          <ViewModificacionModal
            show={showViewModal}
            onHide={() => setShowViewModal(false)}
            modificacionId={selectedEvento.id}
          />
        );
      case 'fichaclinica':
        return (
          <ViewFichaClinicaModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            fichaClinica={selectedEvento}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Container style={{marginTop: '-10px'}} className="bg-custom p-4 rounded">
        <h2 className="mb-4 fw-bold">Tablero de Noticias</h2>
        
        {eventos.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <i className="fas fa-newspaper fa-3x mb-3 text-muted"></i>
              <h3 className="text-muted">No hay noticias disponibles</h3>
              <p className="text-muted">Los eventos más recientes aparecerán aquí</p>
            </Card.Body>
          </Card>
        ) : (
          eventos.map((evento, index) => (
            <Card key={evento.id} className={index === 0 ? "mb-3" : ""}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={6}>
                    <p className="fs-5">
                      {evento.nombreAnimal && (
                        <span><strong>Animal:</strong> {evento.nombreAnimal}</span>
                      )}
                      {evento.nombreAnimal && evento.nombreRecinto && (
                        <span className="mx-2">|</span>
                      )}
                      {evento.nombreRecinto && (
                        <span><strong>Recinto:</strong> {evento.nombreRecinto}</span>
                      )}
                    </p>
                    <p className="fs-5">
                      <strong>Evento:</strong> {evento.tipo}
                    </p>
                    <p className="fs-5">
                      <strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString('es-ES')} - {new Date(evento.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </Col>
                  <Col md={6} className="text-end">
                    {evento.descripcion && (
                      <p><strong>Descripción:</strong> {evento.descripcion}</p>
                    )}
                    {user?.rol !== "Guardafauna" && (
                      <div className="d-flex justify-content-end mt-2">
                        <Button 
                          variant="outline-success" 
                          style={{ fontSize: '1.2rem' }}
                          onClick={() => handleViewClick(evento)}
                        >
                          Ver más información
                        </Button>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>

      {renderModal()}
      {renderViewModal()}

      <div className="text-end mt-5 mb-4">
        <Link to="/manual-usuario" className="text-decoration-none">
          <div 
            className="bg-custom text-white rounded-circle d-inline-flex justify-content-center align-items-center"
            style={{ width: '75px', height: '75px', fontSize: '40px' }}
          >
            ?
          </div>
        </Link>
      </div>
    </>
  );
};


export const Inicio = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [seccion, setSeccion] = useState('principal');
  const { logout, user } = useContext(AuthContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  const cambiarSeccion = (nuevaSeccion) => {
    setSeccion(nuevaSeccion);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formattedDate = currentDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentDate.toLocaleTimeString("es-ES", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const dateTimeString = `${formattedTime} - ${formattedDate}`;

  const handleLogout = () => {
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      text: 'Se cerrará su sesión actual en el sistema',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#70AA68',
      cancelButtonColor: '#d33',
      customClass: {
        popup: 'swal2-show',
        title: 'text-lg font-semibold',
        confirmButton: 'px-4 py-2 rounded-lg',
        cancelButton: 'px-4 py-2 rounded-lg'
      },
      reverseButtons: true,
      focusCancel: true,
      backdrop: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¡Hasta pronto!',
          text: 'La sesión se ha cerrado correctamente',
          icon: 'success',
          confirmButtonColor: '#70AA68',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          logout();
        });
      }
    });
  };

  return (
    <>
      <section className="ordenGeneralInicio">
        <Sidebar
          className="sidebar-custom"
          collapsed={isMobile || !isHovered}
          style={{
            backgroundColor: '#caf4c4',
            borderRadius: '0 35px 35px 0',
            width: (!isMobile && isHovered) ? '200px' : '80px',
            transition: 'width 0.3s ease'
          }}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
        >
          <Menu
            menuItemStyles={{
              button: {
                backgroundColor: 'transparent',
                color: '#4a7c42',
                padding: '12px',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#8ebe94'
                },
                [`&.active`]: {
                  backgroundColor: '#8ebe94',
                  color: '#ffffff',
                  transform: 'scale(1.05)'
                }
              }
            }}
          >
            <MenuItem
              icon={<i className="fa-solid fa-house"></i>}
              onClick={() => setSeccion('principal')}
              className={seccion === 'principal' ? 'active' : ''}
            >
              Inicio
            </MenuItem>
            <MenuItem
              icon={<i className="fa-solid fa-hippo"></i>}
              onClick={() => setSeccion('productos')}
              className={seccion === 'productos' ? 'active' : ''}
            >
              Gestor Animales
            </MenuItem>
            <MenuItem
              icon={<i className="fa fa-globe"></i>}
              onClick={() => setSeccion('hojita')}
              className={seccion === 'hojita' ? 'active' : ''}
            >
              Gestor Recintos
            </MenuItem>
            <MenuItem
              icon={<i className="fa-solid fa-list"></i>}
              onClick={() => setSeccion('eventoAnimal')}
              className={seccion === 'eventoAnimal' ? 'active' : ''}
            >
              Eventos
            </MenuItem>
            <MenuItem
              icon={<i className="fa-solid fa-calendar"></i>}
              onClick={() => setSeccion('supplier')}
              className={seccion === 'supplier' ? 'active' : ''}
            >
              Calendario
            </MenuItem>
            {user && user.rol !== "Guardafauna" && (
              <MenuItem
                icon={<i className="fa-solid fa-chart-line"></i>}
                onClick={() => setSeccion('graficos')}
                className={seccion === 'graficos' ? 'active' : ''}
              >
                Gráficos
              </MenuItem>
            )}
            {user && user.rol === "Administrador" && (
              <MenuItem
                icon={<i className="fa-solid fa-user-gear"></i>}
                onClick={() => setSeccion('administrador')}
                className={seccion === 'administrador' ? 'active' : ''}
              >
                Administrador
              </MenuItem>
            )}
            <MenuItem
              className="logout-button"
              icon={<i className="fa-solid fa-power-off"></i>}
              onClick={handleLogout}
              style={{
                marginTop: 'auto',
                color: '#4a7c42'
              }}
            >
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Sidebar>
        <div className={`inicioArreglo ${!isMobile && isHovered ? 'sidebar-expanded' : ''}`}>
          <article className="ordenDerechaInicio">
            <div className="nombreInicio">
              <h2 className="tituloInicio">
                Bienvenido, {user ? user.nombre + ' ' + user.apellido : "Cargando..."} !
              </h2>
              <p className="fechaInicio">{dateTimeString}</p>
            </div>
          </article>
          {seccion === 'principal' && <SeccionPrincipal setSeccion={setSeccion} />}
          {seccion === 'productos' && <Product />}
          {seccion === 'hojita' && <Hojita />}
          {seccion === 'eventoAnimal' && <EventoAnimal cambiarSeccion={cambiarSeccion} />}
          {seccion === 'supplier' && <Supplier />}
          {seccion === 'graficos' && <Grafico />}
          {seccion === 'administrador' && <Administrador />}
          {seccion === 'eventoRecinto' && <EventoRecinto cambiarSeccion={cambiarSeccion} />}
        </div>
      </section>
    </>
  );
};
