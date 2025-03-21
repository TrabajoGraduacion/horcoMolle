import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Form, Row, Col, Collapse } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const capitalizarTexto = (texto) => {
  return texto
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(' ');
};

const tieneProblemas = (diente) => {
  if (!diente) return false;
  return Object.entries(diente).some(([key, value]) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0;
    if (typeof value === 'string') return value !== '';
    return false;
  });
};

const DienteCollapsible = ({ numero, diente, onDienteChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className={`diente-card ${tieneProblemas(diente) ? 'tiene-problemas' : ''}`}>
      <div className="diente-header" onClick={handleToggle}>
        <span className="numero">#{numero}</span>
        <span className="indicador">
          {tieneProblemas(diente) ? '⚠️' : '✓'}
        </span>
      </div>
      <Collapse in={isOpen}>
        <div className="diente-content" onClick={e => e.stopPropagation()}>
          <div className="diente-seccion">
            <h6>Mediciones</h6>
            <Form.Group className="mb-2">
              <Form.Label>Movilidad</Form.Label>
              <Form.Select
                size="sm"
                value={diente.movilidad}
                onChange={(e) => onDienteChange('movilidad', e.target.value)}
              >
                <option value="">Ninguna</option>
                <option value="1">Grado 1</option>
                <option value="2">Grado 2</option>
                <option value="3">Grado 3</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Exposición Furca</Form.Label>
              <Form.Select
                size="sm"
                value={diente.exposicionFurca}
                onChange={(e) => onDienteChange('exposicionFurca', e.target.value)}
              >
                <option value="">Ninguna</option>
                <option value="I">Grado I</option>
                <option value="II">Grado II</option>
                <option value="III">Grado III</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Cálculo</Form.Label>
              <Form.Select
                size="sm"
                value={diente.calculo}
                onChange={(e) => onDienteChange('calculo', e.target.value)}
              >
                <option value="">Ninguno</option>
                <option value="I">Grado I</option>
                <option value="II">Grado II</option>
                <option value="III">Grado III</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Placa</Form.Label>
              <Form.Select
                size="sm"
                value={diente.placa}
                onChange={(e) => onDienteChange('placa', e.target.value)}
              >
                <option value="">Ninguna</option>
                <option value="I">Grado I</option>
                <option value="II">Grado II</option>
                <option value="III">Grado III</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col xs={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Retracción</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    value={diente.retraccion}
                    onChange={(e) => onDienteChange('retraccion', Number(e.target.value))}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Bolsa P.</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    value={diente.bolsaPeriodontal}
                    onChange={(e) => onDienteChange('bolsaPeriodontal', Number(e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="diente-seccion">
            <h6>Estado</h6>
            <div className="checks-grid">
              {[
                { key: 'gingivitis', label: 'Gingivitis' },
                { key: 'hiperplasiaGingival', label: 'Hiperplasia Gingival' },
                { key: 'ausenciaDiente', label: 'Ausente (ED)' },
                { key: 'exposicionPulpa', label: 'Exposición Pulpa (EP)' },
                { key: 'dienteSupernumerario', label: 'Supernumerario (SN)' },
                { key: 'giroVersion', label: 'Giroversión' },
                { key: 'diastema', label: 'Diastema' },
                { key: 'apiñamiento', label: 'Apiñamiento (AP)' },
                { key: 'oscurecimientoDentina', label: 'Oscurecimiento (OD)' },
                { key: 'erosionEsmalte', label: 'Erosión Esmalte (EE)' },
                { key: 'hipoplasiaEsmalte', label: 'Hipoplasia (HE)' },
                { key: 'lesionReabsorcion', label: 'Lesión Reabsorción' }
              ].map(({ key, label }) => (
                <Form.Check
                  key={key}
                  type="switch"
                  label={label}
                  checked={diente[key]}
                  onChange={(e) => onDienteChange(key, e.target.checked)}
                />
              ))}
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

const OdontogramaAnimal = ({ tipoAnimal, odontograma, handleDienteChange }) => {
  const [seccionActiva, setSeccionActiva] = useState('superiorDerecho');
  
  const config = useMemo(() => 
    CONFIGURACION_DIENTES[tipoAnimal], 
    [tipoAnimal]
  );

  const handleSeccionClick = useCallback((e, seccion) => {
    e.preventDefault();
    e.stopPropagation();
    setSeccionActiva(seccion);
  }, []);

  return (
    <div className="odontograma-wrapper">
      {/* ... resto del componente ... */}
    </div>
  );
};

const uploadFiles = async (file) => {
  const uploadPreset = 'unsigned_preset';
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  const data = await response.json();
  return data.secure_url;
};

const AddOdontogramaModal = ({ show, handleClose, animalId, fichaClinicaId, user, onEventoCreado }) => {
  const [seccionActiva, setSeccionActiva] = useState('superiorDerecho');
  const [currentPage, setCurrentPage] = useState(1);
  const [tipoAnimal, setTipoAnimal] = useState('canidos');
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Estado inicial para un diente
  const initialDienteState = {
    movilidad: '',
    retraccion: 0,
    bolsaPeriodontal: 0,
    exposicionFurca: '',
    hiperplasiaGingival: false,
    calculo: '',
    placa: '',
    gingivitis: false,
    ausenciaDiente: false,
    exposicionPulpa: false,
    dienteSupernumerario: false,
    giroVersion: false,
    diastema: false,
    apiñamiento: false,
    oscurecimientoDentina: false,
    erosionEsmalte: false,
    hipoplasiaEsmalte: false,
    lesionReabsorcion: false
  };

  const [odontograma, setOdontograma] = useState({
    fecha: new Date().toISOString().split('T')[0],
    proximaRevision: '',
    examenGeneral: {
      facialExtraOral: '',
      labios: '',
      gangliosLinfaticos: '',
      amigdalas: '',
      mucosas: '',
      paladar: '',
      faringe: ''
    },
    canidos: null,
    felinos: null,
    primates: null,
    tapires: null,
    cervido: null,
    coipos: null,
    pecaris: null,
    observacionesGenerales: '',
    archivosAdjuntos: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setOdontograma(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setOdontograma(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDienteChange = useCallback((tipoAnimal, seccion, numero, campo, valor) => {
    setOdontograma(prevState => ({
      ...prevState,
      [tipoAnimal]: {
        ...prevState[tipoAnimal],
        [seccion]: {
          ...prevState[tipoAnimal]?.[seccion],
          [numero]: {
            ...(prevState[tipoAnimal]?.[seccion]?.[numero] || initialDienteState),
            [campo]: valor
          }
        }
      }
    }));
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/')
    );

    if (validFiles.length !== files.length) {
      Swal.fire('Error', 'Solo se permiten archivos PDF e imágenes', 'error');
      e.target.value = null;
      return;
    }

    setSelectedFiles(validFiles);
  };

  const renderExamenGeneral = () => {
    return (
      <>
        <h4>Examen General</h4>
        <Form.Group className="mb-3">
          <Form.Label>Facial Extra Oral</Form.Label>
          <Form.Control
            type="text"
            name="examenGeneral.facialExtraOral"
            value={odontograma.examenGeneral.facialExtraOral}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Labios</Form.Label>
          <Form.Control
            type="text"
            name="examenGeneral.labios"
            value={odontograma.examenGeneral.labios}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ganglios Linfáticos</Form.Label>
          <Form.Control
            type="text"
            name="examenGeneral.gangliosLinfaticos"
            value={odontograma.examenGeneral.gangliosLinfaticos}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amígdalas</Form.Label>
          <Form.Control
            type="text"
            name="examenGeneral.amigdalas"
            value={odontograma.examenGeneral.amigdalas}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mucosas</Form.Label>
          <Form.Control
            type="text"
            name="examenGeneral.mucosas"
            value={odontograma.examenGeneral.mucosas}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Paladar</Form.Label>
          <Form.Control
            type="text"
            name="examenGeneral.paladar"
            value={odontograma.examenGeneral.paladar}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Faringe</Form.Label>
          <Form.Control
            type="text"
            name="examenGeneral.faringe"
            value={odontograma.examenGeneral.faringe}
            onChange={handleInputChange}
          />
        </Form.Group>
      </>
    );
  };

  const renderInformacionGeneral = () => {
    return (
      <>
        <h4>Información General</h4>
        <Form.Group className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            name="fecha"
            value={odontograma.fecha}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Próxima Revisión</Form.Label>
          <Form.Control
            type="date"
            name="proximaRevision"
            value={odontograma.proximaRevision}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipo de Animal</Form.Label>
          <Form.Select
            value={tipoAnimal}
            onChange={(e) => setTipoAnimal(e.target.value)}
            required
          >
            <option value="">Seleccione...</option>
            <option value="canidos">Cánidos</option>
            <option value="felinos">Felinos</option>
            <option value="primates">Primates</option>
            <option value="tapires">Tapires</option>
            <option value="cervido">Cérvido</option>
            <option value="coipos">Coipos</option>
            <option value="pecaris">Pecarís</option>
          </Form.Select>
        </Form.Group>
      </>
    );
  };

  const renderObservacionesGenerales = () => {
    return (
      <>
        <h4>Observaciones Generales</h4>
        <Form.Group className="mb-3">
          <Form.Label>Observaciones</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="observacionesGenerales"
            value={odontograma.observacionesGenerales}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Archivos Adjuntos</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,image/*"
          />
          <Form.Text className="text-muted">
            Puede seleccionar múltiples archivos (PDF o imágenes)
          </Form.Text>
        </Form.Group>
      </>
    );
  };

  const renderPageContent = () => {
    switch(currentPage) {
      case 1:
        return renderInformacionGeneral();
      case 2:
        return renderExamenGeneral();
      case 3:
        return renderOdontogramaEspecifico();
      case 4:
        return renderObservacionesGenerales();
      default:
        return null;
    }
  };

  // Definir la configuración de dientes por tipo de animal
  const CONFIGURACION_DIENTES = {
    canidos: {
      nombre: "Cánidos",
      secciones: {
        superiorDerecho: Array.from({length: 10}, (_, i) => (110 - i).toString()),
        superiorIzquierdo: Array.from({length: 10}, (_, i) => (201 + i).toString()),
        inferiorDerecho: Array.from({length: 11}, (_, i) => (411 - i).toString()),
        inferiorIzquierdo: Array.from({length: 11}, (_, i) => (301 + i).toString())
      }
    },
    felinos: {
      nombre: "Felinos",
      secciones: {
        superiorDerecho: Array.from({length: 9}, (_, i) => (109 - i).toString()),
        superiorIzquierdo: Array.from({length: 9}, (_, i) => (201 + i).toString()),
        inferiorDerecho: Array.from({length: 9}, (_, i) => (409 - i).toString()),
        inferiorIzquierdo: Array.from({length: 9}, (_, i) => (301 + i).toString())
      }
    },
    primates: {
      nombre: "Primates",
      secciones: {
        superiorDerecho: Array.from({length: 9}, (_, i) => (109 - i).toString()),
        superiorIzquierdo: Array.from({length: 9}, (_, i) => (201 + i).toString()),
        inferiorDerecho: Array.from({length: 9}, (_, i) => (409 - i).toString()),
        inferiorIzquierdo: Array.from({length: 9}, (_, i) => (301 + i).toString())
      }
    },
    tapires: {
      nombre: "Tapires",
      secciones: {
        superiorDerecho: Array.from({length: 10}, (_, i) => (110 - i).toString()),
        superiorIzquierdo: Array.from({length: 10}, (_, i) => (201 + i).toString()),
        inferiorDerecho: Array.from({length: 10}, (_, i) => (410 - i).toString()),
        inferiorIzquierdo: Array.from({length: 10}, (_, i) => (301 + i).toString())
      }
    },
    cervido: {
      nombre: "Cérvido",
      secciones: {
        superiorDerecho: Array.from({length: 8}, (_, i) => (108 - i).toString()),
        superiorIzquierdo: Array.from({length: 8}, (_, i) => (201 + i).toString()),
        inferiorDerecho: Array.from({length: 11}, (_, i) => (410 - i).toString()),
        inferiorIzquierdo: Array.from({length: 10}, (_, i) => (301 + i).toString())
      }
    },
    coipos: {
      nombre: "Coipos",
      secciones: {
        superiorDerecho: Array.from({length: 5}, (_, i) => (105 - i).toString()),
        superiorIzquierdo: Array.from({length: 5}, (_, i) => (201 + i).toString()),
        inferiorDerecho: Array.from({length: 5}, (_, i) => (405 - i).toString()),
        inferiorIzquierdo: Array.from({length: 5}, (_, i) => (301 + i).toString())
      }
    },
    pecaris: {
      nombre: "Pecarís",
      secciones: {
        superiorDerecho: Array.from({length: 9}, (_, i) => (109 - i).toString()),
        superiorIzquierdo: Array.from({length: 9}, (_, i) => (201 + i).toString()),
        inferiorDerecho: Array.from({length: 10}, (_, i) => (410 - i).toString()),
        inferiorIzquierdo: Array.from({length: 10}, (_, i) => (301 + i).toString())
      }
    }
  };

  const configActual = useMemo(() => 
    CONFIGURACION_DIENTES[tipoAnimal], 
    [tipoAnimal]
  );

  const handleSeccionClick = useCallback((e, seccion) => {
    e.preventDefault();
    e.stopPropagation();
    setSeccionActiva(seccion);
  }, []);

  const DienteCollapsible = useCallback(({ numero, diente, onDienteChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(prev => !prev);
    };

    return (
      <div className={`diente-card ${tieneProblemas(diente) ? 'tiene-problemas' : ''}`}>
        <div className="diente-header" onClick={handleToggle}>
          <span className="numero">#{numero}</span>
          <span className="indicador">
            {tieneProblemas(diente) ? '⚠️' : '✓'}
          </span>
        </div>
        <Collapse in={isOpen}>
          <div className="diente-content" onClick={e => e.stopPropagation()}>
            <div className="diente-seccion">
              <h6>Mediciones</h6>
              <Form.Group className="mb-2">
                <Form.Label>Movilidad</Form.Label>
                <Form.Select
                  size="sm"
                  value={diente.movilidad}
                  onChange={(e) => onDienteChange('movilidad', e.target.value)}
                >
                  <option value="">Ninguna</option>
                  <option value="1">Grado 1</option>
                  <option value="2">Grado 2</option>
                  <option value="3">Grado 3</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Exposición Furca</Form.Label>
                <Form.Select
                  size="sm"
                  value={diente.exposicionFurca}
                  onChange={(e) => onDienteChange('exposicionFurca', e.target.value)}
                >
                  <option value="">Ninguna</option>
                  <option value="I">Grado I</option>
                  <option value="II">Grado II</option>
                  <option value="III">Grado III</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Cálculo</Form.Label>
                <Form.Select
                  size="sm"
                  value={diente.calculo}
                  onChange={(e) => onDienteChange('calculo', e.target.value)}
                >
                  <option value="">Ninguno</option>
                  <option value="I">Grado I</option>
                  <option value="II">Grado II</option>
                  <option value="III">Grado III</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Placa</Form.Label>
                <Form.Select
                  size="sm"
                  value={diente.placa}
                  onChange={(e) => onDienteChange('placa', e.target.value)}
                >
                  <option value="">Ninguna</option>
                  <option value="I">Grado I</option>
                  <option value="II">Grado II</option>
                  <option value="III">Grado III</option>
                </Form.Select>
              </Form.Group>

              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Retracción</Form.Label>
                    <Form.Control
                      size="sm"
                      type="number"
                      value={diente.retraccion}
                      onChange={(e) => onDienteChange('retraccion', Number(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Bolsa P.</Form.Label>
                    <Form.Control
                      size="sm"
                      type="number"
                      value={diente.bolsaPeriodontal}
                      onChange={(e) => onDienteChange('bolsaPeriodontal', Number(e.target.value))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="diente-seccion">
              <h6>Estado</h6>
              <div className="checks-grid">
                {[
                  { key: 'gingivitis', label: 'Gingivitis' },
                  { key: 'hiperplasiaGingival', label: 'Hiperplasia Gingival' },
                  { key: 'ausenciaDiente', label: 'Ausente (ED)' },
                  { key: 'exposicionPulpa', label: 'Exposición Pulpa (EP)' },
                  { key: 'dienteSupernumerario', label: 'Supernumerario (SN)' },
                  { key: 'giroVersion', label: 'Giroversión' },
                  { key: 'diastema', label: 'Diastema' },
                  { key: 'apiñamiento', label: 'Apiñamiento (AP)' },
                  { key: 'oscurecimientoDentina', label: 'Oscurecimiento (OD)' },
                  { key: 'erosionEsmalte', label: 'Erosión Esmalte (EE)' },
                  { key: 'hipoplasiaEsmalte', label: 'Hipoplasia (HE)' },
                  { key: 'lesionReabsorcion', label: 'Lesión Reabsorción' }
                ].map(({ key, label }) => (
                  <Form.Check
                    key={key}
                    type="switch"
                    label={label}
                    checked={diente[key]}
                    onChange={(e) => onDienteChange(key, e.target.checked)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }, []);

  const OdontogramaAnimal = useCallback(({ tipoAnimal, odontograma, handleDienteChange }) => {
    return (
      <div className="odontograma-wrapper">
        <div className="odontograma-header">
          <h4>Odontograma {configActual.nombre}</h4>
        </div>
        
        <div className="secciones-navegacion">
          {Object.entries(configActual.secciones).map(([seccion, dientes]) => (
            <button
              key={seccion}
              type="button"
              onClick={(e) => handleSeccionClick(e, seccion)}
              className={`seccion-nav-btn ${seccionActiva === seccion ? 'activo' : ''}`}
            >
              <div className="seccion-nav-content">
                <span className="seccion-nombre">
                  {capitalizarTexto(seccion)}
                </span>
                <span className="seccion-contador">
                  {dientes.length} dientes
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="seccion-actual">
          <h5 className="seccion-titulo">
            {capitalizarTexto(seccionActiva)}
          </h5>
          <div className="dientes-lista">
            {configActual.secciones[seccionActiva].map(numero => (
              <DienteCollapsible
                key={`${tipoAnimal}-${seccionActiva}-${numero}`}
                numero={numero}
                diente={odontograma[tipoAnimal]?.[seccionActiva]?.[numero] || initialDienteState}
                onDienteChange={(campo, valor) => 
                  handleDienteChange(tipoAnimal, seccionActiva, numero, campo, valor)
                }
              />
            ))}
          </div>
        </div>
      </div>
    );
  }, [seccionActiva, configActual, handleSeccionClick, handleDienteChange]);

  // Reemplazar todos los render*Odontograma con un solo método
  const renderOdontogramaEspecifico = () => {
    if (!tipoAnimal) return <p>Seleccione un tipo de animal</p>;
    
    return (
      <OdontogramaAnimal
        tipoAnimal={tipoAnimal}
        odontograma={odontograma}
        handleDienteChange={handleDienteChange}
      />
    );
  };

  // Manejo del submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPage !== 4) return;
    
    setUploading(true);
    try {
      // Subir archivos
      let archivosUrls = [];
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => uploadFiles(file));
        archivosUrls = await Promise.all(uploadPromises);
      }

      const odontogramaData = {
        ...odontograma,
        archivosAdjuntos: archivosUrls,
        fecha: new Date(odontograma.fecha).toISOString(),
        proximaRevision: odontograma.proximaRevision ? 
          new Date(odontograma.proximaRevision).toISOString() : 
          null,
        [tipoAnimal]: odontograma[tipoAnimal],
        // Limpiar otros tipos de animal que no se están usando
        canidos: tipoAnimal === 'canidos' ? odontograma.canidos : null,
        felinos: tipoAnimal === 'felinos' ? odontograma.felinos : null,
        primates: tipoAnimal === 'primates' ? odontograma.primates : null,
        tapires: tipoAnimal === 'tapires' ? odontograma.tapires : null,
        cervido: tipoAnimal === 'cervido' ? odontograma.cervido : null,
        coipos: tipoAnimal === 'coipos' ? odontograma.coipos : null,
        pecaris: tipoAnimal === 'pecaris' ? odontograma.pecaris : null,
        animalId,
        fichaClinicaId,
        creadoPor: user._id
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_USUARIO}odontograma`,
        odontogramaData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        // Actualizar la ficha clínica
        await axios.put(
          `${import.meta.env.VITE_API_USUARIO}fichaclinica/${fichaClinicaId}`,
          { odontogramaId: response.data.odontogramaId },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Actualizar eventos en localStorage
        const eventosActuales = JSON.parse(localStorage.getItem('eventosCreados') || '[]');
        const nuevosEventos = [...eventosActuales, {
          tipo: 'Odontograma',
          id: response.data._id,
          fecha: response.data.fecha,
          datos: {
            ...response.data,
            archivosUrls
          }
        }];
        localStorage.setItem('eventosCreados', JSON.stringify(nuevosEventos));

        if (typeof onEventoCreado === 'function') {
          onEventoCreado({
            ...response.data,
            archivosUrls
          });
        }

        Swal.fire('Éxito', 'Odontograma guardado correctamente', 'success');
        handleClose();
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Error al guardar el odontograma', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .odontograma-wrapper {
            padding: 0;
            background: #fff;
          }

          .odontograma-header {
            padding: 15px 20px;
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
          }

          .odontograma-header h4 {
            margin: 0;
            color: #2c3e50;
            font-size: 1.25rem;
          }

          .secciones-navegacion {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1px;
            background: #e9ecef;
            padding: 1px;
          }

          .seccion-nav-btn {
            border: none;
            background: #fff;
            padding: 12px 15px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .seccion-nav-btn:hover {
            background: #f8f9fa;
          }

          .seccion-nav-btn.activo {
            background: #007bff;
            color: white;
          }

          .seccion-nav-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .seccion-nombre {
            font-weight: 500;
          }

          .seccion-contador {
            font-size: 0.85em;
            opacity: 0.8;
          }

          .seccion-actual {
            padding: 20px;
          }

          .seccion-titulo {
            margin-bottom: 15px;
            color: #495057;
            font-size: 1.1rem;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
          }

          .dientes-lista {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 15px;
            max-height: 60vh;
            overflow-y: auto;
            padding: 5px;
          }

          .diente-card {
            border: 1px solid #dee2e6;
            border-radius: 4px;
            overflow: hidden;
          }

          .diente-card.tiene-problemas {
            border-color: #ffc107;
          }

          .diente-header {
            padding: 10px;
            background: #f8f9fa;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
          }

          .diente-content {
            padding: 15px;
          }

          .diente-seccion {
            margin-bottom: 15px;
          }

          .diente-seccion h6 {
            margin-bottom: 10px;
            color: #6c757d;
          }

          .checks-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 8px;
          }

          @media (min-width: 768px) {
            .secciones-navegacion {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          @media (max-width: 576px) {
            .seccion-nav-btn {
              padding: 8px 10px;
            }

            .seccion-nombre {
              font-size: 0.9em;
            }

            .seccion-contador {
              font-size: 0.8em;
            }
          }
        `}
      </style>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Odontograma</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {renderPageContent()}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={handleClose}
            >
              Cancelar
            </Button>
            
            {currentPage > 1 && (
              <Button 
                variant="outline-primary"
                type="button"
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Anterior
              </Button>
            )}
            
            {currentPage < 4 && (
              <Button 
                variant="outline-primary"
                type="button"
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Siguiente
              </Button>
            )}
            
            {currentPage === 4 && (
              <Button 
                variant="primary" 
                type="submit"
                disabled={uploading}
              >
                {uploading ? 'Guardando...' : 'Guardar Odontograma'}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddOdontogramaModal;