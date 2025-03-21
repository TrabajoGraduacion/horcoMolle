import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Eye } from 'lucide-react';
import axios from 'axios';
import ViewNecropsiaModal from './Necropsia/ViewNecropsiaModal';
import ViewOdontogramaModal from './Odontograma/ViewOdontogramaModal';
import ViewTratamientoModal from './Tratamiento/ViewTratamientoModal';
import ViewRevisionMedicaModal from './RevisionMedica/ViewRevisionMedicaModal';
import ViewAnestesiaModal from './Anestesia/ViewAnestesiaModal';
import ViewEvolucionModal from './Evolucion/ViewEvolucionModal';
import ViewDiagnosticoModal from './Diagnostico/ViewDiagnosticoModal';
import ViewMedidaMorfologicaModal from './MedidaMorfologica/ViewMedidaMorfologicaModal';
import ViewMetodoComplementarioModal from './MetodoComplementario/ViewMetodoComplementarioModal';

const ViewFichaClinicaModal = ({ show, handleClose, fichaClinica }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fichaData, setFichaData] = useState(null);
  
  // Estados para los modales
  const [showNecropsiaModal, setShowNecropsiaModal] = useState(false);
  const [showOdontogramaModal, setShowOdontogramaModal] = useState(false);
  const [showTratamientoModal, setShowTratamientoModal] = useState(false);
  const [showRevisionMedicaModal, setShowRevisionMedicaModal] = useState(false);
  const [showAnestesiaModal, setShowAnestesiaModal] = useState(false);
  const [showMetodoComplementarioModal, setShowMetodoComplementarioModal] = useState(false);
  const [showMedidasMorfologicasModal, setShowMedidasMorfologicasModal] = useState(false);
  const [showEvolucionModal, setShowEvolucionModal] = useState(false);
  const [showDiagnosticoModal, setShowDiagnosticoModal] = useState(false);

  useEffect(() => {
    if (show && fichaClinica) {
      fetchFichaClinica();
    }
  }, [show, fichaClinica]);

  const fetchFichaClinica = async () => {
    if (!fichaClinica) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinica.id}`);
      setFichaData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener la ficha clínica:', error);
      setError('Error al cargar la ficha clínica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Ficha Clínica</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : fichaData ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Motivo de Consulta</Form.Label>
                <Form.Control
                  type="text"
                  value={fichaData.motivo || ''}
                  readOnly
                />
              </Form.Group>

              <div className="border p-3 mb-3 rounded">
                <h5>Eventos Asociados</h5>
                
                {fichaData?.anestesiaId && (
                  <Button 
                    variant="link"
                    className="me-2 d-block mb-2"
                    onClick={() => setShowAnestesiaModal(true)}
                  >
                    <Eye size={18} className="me-1" />
                    Ver Anestesia
                  </Button>
                )}

                {fichaData?.diagnosticoId && (
                  <Button 
                    variant="link"
                    className="me-2 d-block mb-2"
                    onClick={() => setShowDiagnosticoModal(true)}
                  >
                    <Eye size={18} className="me-1" />
                    Ver Diagnóstico
                  </Button>
                )}

                {fichaData?.tratamientoId && (
                  <Button 
                    variant="link"
                    className="me-2 d-block mb-2"
                    onClick={() => setShowTratamientoModal(true)}
                  >
                    <Eye size={18} className="me-1" />
                    Ver Tratamiento
                  </Button>
                )}

                {fichaData?.metodoComplementarioId && (
                  <Button 
                    variant="link"
                    className="me-2 d-block mb-2"
                    onClick={() => setShowMetodoComplementarioModal(true)}
                  >
                    <Eye size={18} className="me-1" />
                    Ver Método Complementario
                  </Button>
                )}

                {fichaData?.medidasMorfologicasId && (
                  <Button 
                    variant="link"
                    className="me-2 d-block mb-2"
                    onClick={() => setShowMedidasMorfologicasModal(true)}
                  >
                    <Eye size={18} className="me-1" />
                    Ver Medidas Morfológicas
                  </Button>
                )}

                {fichaData?.evolucionId && (
                  <Button 
                    variant="link"
                    className="me-2 d-block mb-2"
                    onClick={() => setShowEvolucionModal(true)}
                  >
                    <Eye size={18} className="me-1" />
                    Ver Evolución
                  </Button>
                )}

                {fichaData?.odontogramaId && (
                  <Button 
                    variant="link"
                    className="me-2 d-block mb-2"
                    onClick={() => setShowOdontogramaModal(true)}
                  >
                    <Eye size={18} className="me-1" />
                    Ver Odontograma
                  </Button>
                )}

                {fichaData?.revisionMedicaId && (
                  <Button 
                    variant="link"
                    className="me-2 d-block mb-2"
                    onClick={() => setShowRevisionMedicaModal(true)}
                  >
                    <Eye size={18} className="me-1" />
                    Ver Revisión Médica
                  </Button>
                )}
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={fichaData.observaciones || ''}
                  readOnly
                />
              </Form.Group>
            </Form>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modales asociados */}
      {fichaData?.necropsiaId && (
        <ViewNecropsiaModal
          show={showNecropsiaModal}
          handleClose={() => setShowNecropsiaModal(false)}
          necropsiaId={fichaData.necropsiaId}
        />
      )}

      {fichaData?.odontogramaId && (
        <ViewOdontogramaModal
          show={showOdontogramaModal}
          handleClose={() => setShowOdontogramaModal(false)}
          odontogramaId={fichaData.odontogramaId}
        />
      )}

      {fichaData?.tratamientoId && (
        <ViewTratamientoModal
          show={showTratamientoModal}
          handleClose={() => setShowTratamientoModal(false)}
          tratamientoId={fichaData.tratamientoId}
        />
      )}

      {fichaData?.revisionMedicaId && (
        <ViewRevisionMedicaModal
          show={showRevisionMedicaModal}
          handleClose={() => setShowRevisionMedicaModal(false)}
          revisionMedicaId={fichaData.revisionMedicaId}
        />
      )}

      {fichaData?.anestesiaId && (
        <ViewAnestesiaModal
          show={showAnestesiaModal}
          handleClose={() => setShowAnestesiaModal(false)}
          anestesiaId={fichaData.anestesiaId}
        />
      )}

      {fichaData?.metodoComplementarioId && (
        <ViewMetodoComplementarioModal
          show={showMetodoComplementarioModal}
          handleClose={() => setShowMetodoComplementarioModal(false)}
          metodoId={fichaData.metodoComplementarioId}
        />
      )}

      {fichaData?.medidasMorfologicasId && (
        <ViewMedidaMorfologicaModal
          show={showMedidasMorfologicasModal}
          handleClose={() => setShowMedidasMorfologicasModal(false)}
          medidaId={fichaData.medidasMorfologicasId}
        />
      )}

      {fichaData?.evolucionId && (
        <ViewEvolucionModal
          show={showEvolucionModal}
          handleClose={() => setShowEvolucionModal(false)}
          evolucionId={fichaData.evolucionId}
        />
      )}

      {fichaData?.diagnosticoId && (
        <ViewDiagnosticoModal
          show={showDiagnosticoModal}
          handleClose={() => setShowDiagnosticoModal(false)}
          diagnosticoId={fichaData.diagnosticoId}
        />
      )}
    </>
  );
};

export default ViewFichaClinicaModal; 