import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Carousel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRuler, faRulerHorizontal, faRulerVertical,
  faVectorSquare, faMapMarkerAlt, faCalendarAlt,
  faHashtag, faPaw, faUsers, faClipboardList,
  faTree, faCloud, faShieldAlt, faGraduationCap,
  faLeaf, faWater, faSun, faHome, faImage, faTimes
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ViewRecintoModal = ({ show, handleClose, recintoId }) => {
  const [recinto, setRecinto] = useState(null);

  useEffect(() => {
    if (show && recintoId) { // Asegurar que se ejecute solo cuando el modal esté abierto y tengamos un recintoId
      const fetchRecinto = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}recintos/${recintoId}`);
          setRecinto(response.data);
        } catch (error) {
          console.error('Error al obtener los detalles del recinto:', error);
        }
      };
      fetchRecinto();
    }
  }, [show, recintoId]); // El efecto se ejecuta cuando cambia 'show' o 'recintoId'

  // Estilos
  const sectionStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)'
    }
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

  const subtitleStyle = {
    color: '#4A5568',
    fontSize: '1.2rem',
    fontWeight: '500',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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

  const cardStyle = {
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const iconStyle = {
    color: '#70AA68',
    marginRight: '8px',
    fontSize: '1.1rem'
  };

  const dimensionCardStyle = {
    ...cardStyle,
    textAlign: 'center',
    padding: '20px'
  };

  const dimensionValueStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2C5282',
    marginTop: '8px'
  };

  const renderDimensionCard = (label, value, icon, unit = 'm') => (
    <div style={dimensionCardStyle}>
      <FontAwesomeIcon icon={icon} style={{ fontSize: '1.8rem', color: '#70AA68', marginBottom: '10px' }} />
      <div style={{ color: '#4A5568', fontSize: '0.9rem' }}>{label}</div>
      <div style={dimensionValueStyle}>
        {value} {unit}
      </div>
    </div>
  );

  const renderInfoSection = (label, value, icon) => (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ color: '#4A5568', fontWeight: '600', fontSize: '0.95rem', marginBottom: '5px' }}>
        <FontAwesomeIcon icon={icon} style={iconStyle} />
        {label}
      </div>
      <div style={{ 
        color: '#2D3748', 
        fontSize: '0.95rem',
        backgroundColor: '#f8f9fa',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #e9ecef'
      }}>
        {value}
      </div>
    </div>
  );

  // Render para ambientes externos/internos
  const renderAmbiente = (ambiente, index, tipo) => (
    <div key={index} style={sectionStyle}>
      <h5 style={subtitleStyle}>{tipo} {index + 1}: {ambiente.nombre}</h5>
      
      <div className="ambiente-info">
        <Row className="mb-3">
          <Col>
            <div style={labelStyle}>Dimensiones</div>
            <div style={valueStyle}>
              {ambiente.dimensiones.largo} m × {ambiente.dimensiones.ancho} m × {ambiente.dimensiones.alto} m
              <span className="ms-2 text-muted">(Área: {ambiente.dimensiones.area} m²)</span>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <div style={labelStyle}>Cobertura Lateral</div>
            <div style={valueStyle}>{ambiente.estructura.coberturaLateral}</div>
          </Col>
          <Col md={6}>
            <div style={labelStyle}>Sostén</div>
            <div style={valueStyle}>{ambiente.estructura.sosten}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <div style={labelStyle}>Cobertura Superior</div>
            <div style={valueStyle}>{ambiente.estructura.coberturaSuperior}</div>
          </Col>
          <Col md={6}>
            <div style={labelStyle}>Mangas/Jaulas de Manejo</div>
            <div style={valueStyle}>{ambiente.estructura.mangasJaulasManejo}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <div style={labelStyle}>Comederos y Bebederos</div>
            <div style={valueStyle}>{ambiente.ambientacion.comederosBebederos || ambiente.ambientacion.comederos}</div>
          </Col>
          <Col md={6}>
            <div style={labelStyle}>Refugios</div>
            <div style={valueStyle}>{ambiente.ambientacion.refugios}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <div style={labelStyle}>Vegetación</div>
            <div style={valueStyle}>{ambiente.ambientacion.vegetacion}</div>
          </Col>
          <Col md={6}>
            <div style={labelStyle}>Clima</div>
            <div style={valueStyle}>{ambiente.ambientacion.clima}</div>
          </Col>
        </Row>

        {ambiente.observaciones && (
          <Row>
            <Col>
              <div style={labelStyle}>Observaciones</div>
              <div style={valueStyle}>{ambiente.observaciones}</div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );

  if (!recinto) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={{ 
        borderBottom: '2px solid #70AA68',
        background: 'linear-gradient(to right, #70AA68, #90c58e)'
      }}>
        <Modal.Title style={{ color: '#fff' }}>
          Detalles del Recinto
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: '#f8f9fa', padding: '25px' }}>
        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faClipboardList} />
            Información General
          </h4>
          
          <Row className="mb-4">
            <Col md={6}>
              {renderInfoSection('Nombre', recinto.nombre, faClipboardList)}
              {renderInfoSection('Código', recinto.codigo, faHashtag)}
            </Col>
            <Col md={6}>
              {renderInfoSection('Fecha de Instalación', 
                new Date(recinto.fechaInstalacion).toLocaleDateString(), 
                faCalendarAlt)}
              {renderInfoSection('Ubicación', recinto.ubicacion, faMapMarkerAlt)}
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              {renderInfoSection('Especie', recinto.especie, faPaw)}
            </Col>
            <Col md={6}>
              {renderInfoSection('Número de Individuos', 
                recinto.numeroIndividuosRecomendados, 
                faUsers)}
            </Col>
          </Row>
        </section>

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faVectorSquare} />
            Dimensiones Generales
          </h4>
          
          <Row className="mb-4">
            <Col md={3}>
              {renderDimensionCard('Largo', recinto.dimensionesGenerales.largo, faRulerHorizontal)}
            </Col>
            <Col md={3}>
              {renderDimensionCard('Ancho', recinto.dimensionesGenerales.ancho, faRulerHorizontal)}
            </Col>
            <Col md={3}>
              {renderDimensionCard('Alto', recinto.dimensionesGenerales.alto, faRulerVertical)}
            </Col>
            <Col md={3}>
              {renderDimensionCard('Área', recinto.dimensionesGenerales.area, faVectorSquare, 'm²')}
            </Col>
          </Row>

          <div style={{ marginLeft: '20px' }}>
            <h5 style={subtitleStyle}>Ala Izquierda</h5>
            <Row className="mb-4">
              <Col md={3}>
                <div style={labelStyle}>Largo</div>
                <div style={valueStyle}>{recinto.dimensionesGenerales.alaIzquierda.largo} m</div>
              </Col>
              <Col md={3}>
                <div style={labelStyle}>Ancho</div>
                <div style={valueStyle}>{recinto.dimensionesGenerales.alaIzquierda.ancho} m</div>
              </Col>
              <Col md={3}>
                <div style={labelStyle}>Alto</div>
                <div style={valueStyle}>{recinto.dimensionesGenerales.alaIzquierda.alto} m</div>
              </Col>
              <Col md={3}>
                <div style={labelStyle}>Área</div>
                <div style={valueStyle}>{recinto.dimensionesGenerales.alaIzquierda.area} m²</div>
              </Col>
            </Row>

            <h5 style={subtitleStyle}>Ala Derecha</h5>
            <Row>
              <Col md={3}>
                <div style={labelStyle}>Largo</div>
                <div style={valueStyle}>{recinto.dimensionesGenerales.alaDerecha.largo} m</div>
              </Col>
              <Col md={3}>
                <div style={labelStyle}>Ancho</div>
                <div style={valueStyle}>{recinto.dimensionesGenerales.alaDerecha.ancho} m</div>
              </Col>
              <Col md={3}>
                <div style={labelStyle}>Alto</div>
                <div style={valueStyle}>{recinto.dimensionesGenerales.alaDerecha.alto} m</div>
              </Col>
              <Col md={3}>
                <div style={labelStyle}>Área</div>
                <div style={valueStyle}>{recinto.dimensionesGenerales.alaDerecha.area} m²</div>
              </Col>
            </Row>
          </div>
        </section>

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faTree} />
            Ambientes Externos
          </h4>
          
          {recinto.ambientesExternos.map((ambiente, index) => 
            renderAmbiente(ambiente, index, "Ambiente Externo")
          )}
        </section>

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faTree} />
            Ambientes Internos
          </h4>
          
          {recinto.ambientesInternos.map((ambiente, index) => 
            renderAmbiente(ambiente, index, "Ambiente Interno")
          )}
        </section>

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faShieldAlt} />
            Condiciones
          </h4>
          
          <Row className="mb-4">
            <Col md={4}>
              <div style={cardStyle}>
                <FontAwesomeIcon icon={faCloud} style={{ fontSize: '2rem', color: '#70AA68', marginBottom: '10px' }} />
                <h6 style={{ color: '#2C5282', marginBottom: '10px' }}>Condiciones Ambientales</h6>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{recinto.condicionesAmbientales}</p>
              </div>
            </Col>
            <Col md={4}>
              <div style={cardStyle}>
                <FontAwesomeIcon icon={faShieldAlt} style={{ fontSize: '2rem', color: '#70AA68', marginBottom: '10px' }} />
                <h6 style={{ color: '#2C5282', marginBottom: '10px' }}>Bioseguridad</h6>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{recinto.condicionesBioseguridad}</p>
              </div>
            </Col>
            <Col md={4}>
              <div style={cardStyle}>
                <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '2rem', color: '#70AA68', marginBottom: '10px' }} />
                <h6 style={{ color: '#2C5282', marginBottom: '10px' }}>Calidad Didáctica</h6>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{recinto.calidadDidactica}</p>
              </div>
            </Col>
          </Row>
        </section>

        <section style={sectionStyle}>
          <h4 style={titleStyle}>
            <FontAwesomeIcon icon={faImage} />
            Galería
          </h4>
          
          {recinto.fotos.length > 0 ? (
            <Carousel style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {recinto.fotos.map((foto, index) => (
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

export default ViewRecintoModal;
