import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Eye } from 'lucide-react';
import ViewDietaModal from '../Eventos/EventosAnimal/Dieta/ViewDietaModal';
import ViewEgresoModal from '../Eventos/EventosAnimal/Egreso/ViewEgresoModal';
import ViewEnriquecimientoModal from '../Eventos/EventosAnimal/Enriquecimiento/ViewEnriquecimientoModal';
import ViewObservacionDiariaModal from '../Eventos/EventosAnimal/ObservacionDiaria/ViewObservacionDiariaModal';
import ViewRelocalizacionModal from '../Eventos/EventosAnimal/Relocalizacion/ViewRelocalizacionModal';
import ViewProductModal from '../product/ViewProductModal';
import ViewMedidasMorfologicasModal from '../Eventos/EventosAnimal/FichaClinica/MedidaMorfologica/ViewMedidaMorfologicaModal';
import ViewAnestesiaModal from '../Eventos/EventosAnimal/FichaClinica/Anestesia/ViewAnestesiaModal';
import ViewEvolucionModal from '../Eventos/EventosAnimal/FichaClinica/Evolucion/ViewEvolucionModal';
import ViewTratamientoModal from '../Eventos/EventosAnimal/FichaClinica/Tratamiento/ViewTratamientoModal';
import ViewFichaClinicaModal from '../Eventos/EventosAnimal/FichaClinica/ViewFichaClinicaModal';
import ViewOdontogramaModal from '../Eventos/EventosAnimal/FichaClinica/Odontograma/ViewOdontogramaModal';
import ViewNecropsiaModal from '../Eventos/EventosAnimal/FichaClinica/Necropsia/ViewNecropsiaModal';
import ViewMetodoComplementarioModal from '../Eventos/EventosAnimal/FichaClinica/MetodoComplementario/ViewMetodoComplementarioModal';
import ViewDiagnosticoModal from '../Eventos/EventosAnimal/FichaClinica/Diagnostico/ViewDiagnosticoModal';
import ViewMedidaMorfologicaModal from '../Eventos/EventosAnimal/FichaClinica/MedidaMorfologica/ViewMedidaMorfologicaModal';
import { AuthContext } from '../../../../context/AuthContext';

const ViewEventosCalendarioModal = ({ show, handleClose, eventos, fecha }) => {
  const { user } = useContext(AuthContext);
  const [eventosDetallados, setEventosDetallados] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [tipoEventoSeleccionado, setTipoEventoSeleccionado] = useState(null);
  const [showViewProductModal, setShowViewProductModal] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);

  useEffect(() => {
    const fetchEventosDetallados = async () => {
      try {
        console.log('Eventos recibidos:', eventos);
        const eventosPromises = eventos.map(async (evento) => {
          // Normalizar el tipo de evento (convertir a minúsculas y reemplazar espacios)
          const tipoNormalizado = evento.tipo
            .toLowerCase()
            .replace(/\s+/g, '')
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""); // Eliminar acentos

          const eventoBase = {
            ...evento,
            animalId: evento.animalId
          };

          let ruta = '';
          switch (tipoNormalizado) {
            case 'observaciondiaria':
              ruta = 'observaciones-diarias';
              break;
            case 'medidasmorfologicas':
              ruta = 'medidas-morfologicas';
              break;
            case 'evolucion':
              ruta = 'evoluciones';
              break;
            case 'enriquecimiento':
              ruta = 'enriquecimiento';
              break;
            case 'ingreso':
              ruta = 'ingresos';
              break;
            case 'egreso':
              ruta = 'egresos';
              break;
            case 'relocalizacion':
              ruta = 'relocalizacion';
              break;
            case 'dieta':
              ruta = 'dietas';
              break;
            case 'fichaclinica':
              ruta = 'fichaClinica';
              break;
            case 'anestesia':
              ruta = 'anestesia';
              break;
            case 'tratamiento':
              ruta = 'tratamiento';
              break;
            case 'odontograma':
              ruta = 'odontograma';
              break;
            case 'necropsia':
              ruta = 'necropsia';
              break;
            case 'metodoscomplementarios':
              ruta = 'metodos-complementarios';
              break;
            case 'diagnostico':
              ruta = 'diagnostico';
              break;
            default:
              console.log('Tipo de evento original:', evento.tipo);
              console.log('Tipo de evento normalizado:', tipoNormalizado);
              return null;
          }

          if (!ruta) return null;

          try {
            const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}${ruta}/${evento.id}`);
            return {
              ...response.data,
              tipo: evento.tipo // Mantener el tipo original para la visualización
            };
          } catch (error) {
            console.error(`Error al obtener evento de tipo ${evento.tipo}:`, error);
            return null;
          }
        });

        const detalles = (await Promise.all(eventosPromises)).filter(evento => evento !== null);
        setEventosDetallados(detalles);
      } catch (error) {
        console.error('Error al obtener detalles de eventos:', error);
      }
    };

    if (show && eventos.length > 0) {
      fetchEventosDetallados();
    }
  }, [show, eventos]);

  const getIconForEventType = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'observaciondiaria':
        return <i className="fas fa-clipboard me-2"></i>;
      case 'enriquecimiento':
        return <i className="fas fa-puzzle-piece me-2"></i>;
      case 'ingreso':
        return <i className="fas fa-sign-in-alt me-2"></i>;
      case 'egreso':
        return <i className="fas fa-sign-out-alt me-2"></i>;
      case 'relocalizacion':
        return <i className="fas fa-map-marker-alt me-2"></i>;
      case 'dieta':
        return <i className="fas fa-utensils me-2"></i>;
      case 'fichaclinica':
        return <i className="fas fa-notes-medical me-2"></i>;
      case 'medidasmorfologicas':
        return <i className="fas fa-ruler me-2"></i>;
      case 'anestesia':
        return <i className="fas fa-syringe me-2"></i>;
      case 'evolucion':
        return <i className="fas fa-chart-line me-2"></i>;
      case 'tratamiento':
        return <i className="fas fa-pills me-2"></i>;
      case 'odontograma':
        return <i className="fas fa-tooth me-2"></i>;
      case 'necropsia':
        return <i className="fas fa-skull-crossbones me-2"></i>;
      case 'metodoscomplementarios':
        return <i className="fas fa-plus me-2"></i>;
      case 'diagnostico':
        return <i className="fas fa-stethoscope me-2"></i>;
      default:
        return <i className="fas fa-calendar-day me-2"></i>;
    }
  };

  const handleViewClick = async (evento, tipo) => {
    console.log('Evento seleccionado:', evento);
    setSelectedEvento({
      ...evento,
      id: evento._id
    });
    setTipoEventoSeleccionado(tipo);
  
    if (tipo.toLowerCase() === 'ingreso') {
      if (evento.animalId) {
        setSelectedAnimalId(evento.animalId);
        setShowViewProductModal(true);
      } else {
        console.error('No se encontró el animalId en el evento:', evento);
      }
    } else {
      setShowViewModal(true);
    }
  };


  const renderViewModal = () => {
    // Normalizar el tipo de evento seleccionado
    const tipoNormalizado = tipoEventoSeleccionado
      ?.toLowerCase()
      .replace(/\s+/g, '')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    console.log('Tipo normalizado:', tipoNormalizado);
    console.log('Evento seleccionado en renderViewModal:', selectedEvento);

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
      case 'observaciondiaria':
        return (
          <ViewObservacionDiariaModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            observacion={selectedEvento}
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
      case 'egreso':
        return (
          <ViewEgresoModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            egreso={selectedEvento}
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
      case 'dieta':
        return (
          <ViewDietaModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            dieta={selectedEvento}
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
      case 'tratamiento':
        return (
          <ViewTratamientoModal
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            tratamientoId={selectedEvento.id}
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
      default:
        return null;
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
    Eventos del {new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES')}
  </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="eventos-list">
            {eventosDetallados.map((evento, index) => (
              <div key={index} className="evento-item d-flex justify-content-between align-items-center p-3 mb-2 border rounded">
                <div className="d-flex align-items-center">
                  {getIconForEventType(evento.tipo)}
                  <span>{evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)} - {evento.nombreInstitucionalAnimal || 'Animal no especificado'}</span>
                </div>
                {user?.rol !== "Guardafauna" && (
                  <Button 
                    variant="link" 
                    onClick={() => handleViewClick(evento, evento.tipo)}
                    className="text-primary"
                  >
                    <Eye size={18} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {user?.rol !== "Guardafauna" && (
        <>
          <ViewProductModal
            show={showViewProductModal}
            handleClose={() => setShowViewProductModal(false)}
            animalId={selectedAnimalId}
          />
          {renderViewModal()}
        </>
      )}
    </>
  );
};

export default ViewEventosCalendarioModal;