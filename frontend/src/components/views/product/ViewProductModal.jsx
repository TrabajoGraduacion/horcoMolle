import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Image, Carousel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaw, 
  faClipboardList, 
  faCalendarAlt, 
  faMapMarkerAlt,
  faUserAlt,
  faHospital,
  faHome,
  faImage,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ViewProductModal = ({ show, handleClose, animalId }) => {
  const [product, setProduct] = useState(null);
  const [ingreso, setIngreso] = useState(null);
  const [recinto, setRecinto] = useState(null);
  const [docenteAutoriza, setDocenteAutoriza] = useState(null);

  useEffect(() => {
    if (show && animalId) {
      const fetchData = async () => {
        try {
          const productResponse = await axios.get(`${import.meta.env.VITE_API_USUARIO}animales/${animalId}`);
          setProduct(productResponse.data);

          const ingresosResponse = await axios.get(`${import.meta.env.VITE_API_USUARIO}ingresos`);
          const ingresoData = ingresosResponse.data.find(ing => ing.animalId === animalId);
          setIngreso(ingresoData);

          if (ingresoData) {
            if (ingresoData.recintoId) {
              const recintoResponse = await axios.get(`${import.meta.env.VITE_API_USUARIO}recintos/${ingresoData.recintoId}`);
              setRecinto(recintoResponse.data);
            }
            if (ingresoData.docenteAutorizaIngreso) {
              const docenteResponse = await axios.get(`${import.meta.env.VITE_API_USUARIO}usuarios/${ingresoData.docenteAutorizaIngreso}`);
              setDocenteAutoriza(docenteResponse.data);
            }
          }
        } catch (error) {
          console.error('Error al obtener los detalles:', error);
        }
      };
      fetchData();
    }
  }, [show, animalId]);

  const sectionStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
    border: '1px solid #e0e0e0'
  };

  const titleStyle = {
    color: '#2C5282',
    borderBottom: '2px solid #70AA68',
    paddingBottom: '12px',
    marginBottom: '25px',
    fontSize: '1.6rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const labelStyle = {
    color: '#4A5568',
    fontWeight: '600',
    fontSize: '0.95rem',
    marginBottom: '5px'
  };

  const valueStyle = {
    color: '#2D3748',
    fontSize: '0.95rem',
    backgroundColor: '#f8f9fa',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e9ecef'
  };

  const getDecimalValue = (value) => {
    if (!value) return '-';
    if (value.$numberDecimal) {
      return `${Number(value.$numberDecimal).toFixed(2)} kg`;
    }
    if (isNaN(value)) return '-';
    return `${Number(value).toFixed(2)} kg`;
  };

  const getValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return value;
  };

  if (!product || !ingreso) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton style={{ 
        borderBottom: '2px solid #70AA68',
        background: 'linear-gradient(to right, #70AA68, #90c58e)'
      }}>
        <Modal.Title style={{ color: '#fff' }}>Detalles del Animal</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: '#f8f9fa', padding: '25px' }}>
        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faPaw} />
            Datos del Animal
          </h4>
          
          <Row className="mb-4">
            <Col md={6}>
              <div style={labelStyle}>Nombre Vulgar</div>
              <div style={valueStyle}>{getValue(product.nombreVulgar)}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Nombre Científico</div>
              <div style={valueStyle}>{getValue(product.nombreCientifico)}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <div style={labelStyle}>Pseudónimo</div>
              <div style={valueStyle}>{getValue(product.pseudonimo)}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Nombre Institucional</div>
              <div style={valueStyle}>{getValue(product.nombreInstitucional)}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <div style={labelStyle}>Número de Chip</div>
              <div style={valueStyle}>{getValue(product.chipNumero)}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Anillo/Caravana de Identificación</div>
              <div style={valueStyle}>{getValue(product.anilloCaravanaIdentificacion)}</div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div style={labelStyle}>Sexo</div>
              <div style={valueStyle}>{getValue(product.sexo)}</div>
            </Col>
          </Row>
        </section>

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faClipboardList} />
            Datos del Ingreso
          </h4>
          
          <Row className="mb-4">
            <Col md={6}>
              <div style={labelStyle}>Fecha de Ingreso</div>
              <div style={valueStyle}>{new Date(ingreso.fechaIngreso).toLocaleDateString()}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Categoría de Edad</div>
              <div style={valueStyle}>{ingreso.edadCategoria}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <div style={labelStyle}>Edad Exacta</div>
              <div style={valueStyle}>
                {ingreso.edadExacta?.valor || 'N/A'} {ingreso.edadExacta?.unidad || ''}
              </div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Estado de Salud</div>
              <div style={valueStyle}>{ingreso.estadoSalud || 'N/A'}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <div style={labelStyle}>Peso</div>
              <div style={valueStyle}>{getDecimalValue(ingreso.peso)}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Medidas Biométricas</div>
              <div style={valueStyle}>{getValue(ingreso.medidasBiometricas)}</div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div style={labelStyle}>Recinto</div>
              <div style={valueStyle}>{recinto ? recinto.nombre : 'No especificado'}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Condición del Recinto</div>
              <div style={valueStyle}>{ingreso.condicionRecinto}</div>
            </Col>
          </Row>
        </section>

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            Datos del Rescate y Lugar de Obtención
          </h4>
          
          <Row className="mb-4">
            <Col md={6}>
              <div style={labelStyle}>Origen</div>
              <div style={valueStyle}>{ingreso.origen}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Motivo del Rescate</div>
              <div style={valueStyle}>{ingreso.motivoRescate}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <div style={labelStyle}>Historia del Animal</div>
              <div style={valueStyle}>{ingreso.historiaVida}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <div style={labelStyle}>Número de Infracción</div>
              <div style={valueStyle}>{ingreso.infraccionNumero}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Autorización de Intervención</div>
              <div style={valueStyle}>{ingreso.autorizacionIntervencion}</div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div style={labelStyle}>Lugar de Obtención</div>
              <div style={valueStyle}>{ingreso.lugarObtencion?.lugar}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Dirección</div>
              <div style={valueStyle}>{ingreso.lugarObtencion?.direccion}</div>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <div style={labelStyle}>Localidad</div>
              <div style={valueStyle}>{ingreso.lugarObtencion?.localidad}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Provincia</div>
              <div style={valueStyle}>{ingreso.lugarObtencion?.provincia}</div>
            </Col>
          </Row>
        </section>

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faHospital} />
            Información de Cautiverio
          </h4>
          
          <Row className="mb-4">
            <Col>
              <div style={labelStyle}>Fecha de Inicio del Cautiverio</div>
              <div style={valueStyle}>{new Date(ingreso.fechaInicioCautiverio).toLocaleDateString()}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <div style={labelStyle}>Alimentación Recibida</div>
              <div style={valueStyle}>{ingreso.alimentacionRecibida}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <div style={labelStyle}>Condición durante el Cautiverio</div>
              <div style={valueStyle}>{ingreso.condicionCautiverio}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <div style={labelStyle}>Motivo de Atención Veterinaria</div>
              <div style={valueStyle}>{ingreso.motivoAtencionVeterinaria}</div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div style={labelStyle}>Veterinario</div>
              <div style={valueStyle}>{ingreso.veterinario}</div>
            </Col>
            <Col md={6}>
              <div style={labelStyle}>Contacto del Veterinario</div>
              <div style={valueStyle}>{ingreso.contactoVeterinario}</div>
            </Col>
          </Row>
        </section>

        {ingreso.donante && (
          <section style={sectionStyle}>
            <h4 style={titleStyle}>
              <FontAwesomeIcon icon={faUserAlt} />
              Información del Donante
            </h4>
            
            <Row className="mb-4">
              <Col md={6}>
                <div style={labelStyle}>Apellido</div>
                <div style={valueStyle}>{ingreso.donante.apellido}</div>
              </Col>
              <Col md={6}>
                <div style={labelStyle}>Nombre</div>
                <div style={valueStyle}>{ingreso.donante.nombre}</div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <div style={labelStyle}>DNI</div>
                <div style={valueStyle}>{ingreso.donante.dni}</div>
              </Col>
              <Col md={6}>
                <div style={labelStyle}>Domicilio</div>
                <div style={valueStyle}>{ingreso.donante.domicilio}</div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <div style={labelStyle}>Localidad</div>
                <div style={valueStyle}>{ingreso.donante.localidad}</div>
              </Col>
              <Col md={6}>
                <div style={labelStyle}>Provincia</div>
                <div style={valueStyle}>{ingreso.donante.provincia}</div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <div style={labelStyle}>Teléfono</div>
                <div style={valueStyle}>{ingreso.donante.telefono}</div>
              </Col>
              <Col md={6}>
                <div style={labelStyle}>Email</div>
                <div style={valueStyle}>{ingreso.donante.email}</div>
              </Col>
            </Row>

            <Row>
              <Col>
                <div style={labelStyle}>¿Se contactó con Fauna?</div>
                <div style={valueStyle}>{ingreso.donante.contactoFauna ? 'Sí' : 'No'}</div>
              </Col>
            </Row>
          </section>
        )}

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faGraduationCap} />
            Docente y Notas
          </h4>
          
          <Row className="mb-4">
            <Col md={6}>
              <div style={labelStyle}>Docente que Autoriza</div>
              <div style={valueStyle}>
                {docenteAutoriza ? `${docenteAutoriza.nombre} ${docenteAutoriza.apellido}` : '-'}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div style={labelStyle}>Notas Adicionales</div>
              <div style={valueStyle}>{getValue(ingreso.notasAdicionales)}</div>
            </Col>
          </Row>
        </section>

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faImage} />
            Galería
          </h4>
          
          {ingreso.archivos && ingreso.archivos.length > 0 ? (
            <Carousel style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {ingreso.archivos.map((foto, index) => (
                <Carousel.Item key={index}>
                  <div style={{
                    width: '100%',
                    height: '500px',
                    position: 'relative'
                  }}>
                    <Image
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '20px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: '#fff'
                    }}>
                      <h5>Foto {index + 1}</h5>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#666',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <FontAwesomeIcon icon={faImage} style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.5 }} />
              <p>No hay fotos disponibles</p>
            </div>
          )}
        </section>
      </Modal.Body>

      <Modal.Footer style={{ 
        borderTop: '2px solid #70AA68',
        padding: '15px 25px'
      }}>
        <Button 
          variant="secondary" 
          onClick={handleClose}
          style={{
            backgroundColor: '#70AA68',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 25px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5C8F55';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#70AA68';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewProductModal;