import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const AddOfferModal = ({ show, handleClose, handleAdd }) => {
  const fileInputRef = useRef(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    fechaInstalacion: '',
    codigo: '',
    ubicacion: '',
    especie: '',
    numeroIndividuosRecomendados: '',
    descripcionRecinto: '',
    condicionesAmbientales: '',
    condicionesBioseguridad: '',
    calidadDidactica: '',
    dimensionesGenerales: {
      largo: '',
      ancho: '',
      alto: '',
      area: '',
      alaIzquierda: {
        largo: '',
        ancho: '',
        alto: '',
        area: ''
      },
      alaDerecha: {
        largo: '',
        ancho: '',
        alto: '',
        area: ''
      }
    },
    ambientesExternos: [],
    ambientesInternos: [],
    adjuntos: [],
    activo: true, // Por defecto, el recinto está activo
  });

  const [uploading, setUploading] = useState(false);

  // Estado para manejar las imágenes seleccionadas
  const [selectedImages, setSelectedImages] = useState([]);

  // Agregar al inicio del componente, después de los otros estados
  const [previewImage, setPreviewImage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Modificar los estados de preview
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Crear URLs memoizadas para las imágenes
  const lightboxImages = React.useMemo(() => 
    Array.from(selectedImages).map(file => ({
      src: URL.createObjectURL(file),
      alt: file.name
    })),
    [selectedImages] // Solo se recalcula cuando selectedImages cambia
  );

  // Limpiar las URLs cuando el componente se desmonte o selectedImages cambie
  React.useEffect(() => {
    return () => {
      lightboxImages.forEach(image => URL.revokeObjectURL(image.src));
    };
  }, [lightboxImages]);

  // Función para manejar cambios en campos anidados
  const handleNestedChange = (e, index, tipo, campo, subCampo) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      const newAmbientes = [...prevState[tipo]];
      
      if (subCampo) {
        newAmbientes[index][campo][subCampo] = value;
        
        // Calcular área para dimensiones
        if (campo === 'dimensiones' && 
            (subCampo === 'largo' || subCampo === 'ancho') && 
            newAmbientes[index].dimensiones.largo && 
            newAmbientes[index].dimensiones.ancho) {
          newAmbientes[index].dimensiones.area = (
            parseFloat(newAmbientes[index].dimensiones.largo) * 
            parseFloat(newAmbientes[index].dimensiones.ancho)
          ).toFixed(2);
        }
      } else {
        newAmbientes[index][campo] = value;
      }
      
      return {
        ...prevState,
        [tipo]: newAmbientes
      };
    });
  };

  // Función para manejar cambios generales en campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDimensionesChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      const newDimensiones = {
        ...prevState.dimensionesGenerales,
        [name]: value
      };
      
      // Calcular área si tenemos largo y ancho
      if ((name === 'largo' || name === 'ancho') && newDimensiones.largo && newDimensiones.ancho) {
        newDimensiones.area = (parseFloat(newDimensiones.largo) * parseFloat(newDimensiones.ancho)).toFixed(2);
      }
      
      return {
        ...prevState,
        dimensionesGenerales: newDimensiones
      };
    });
  };

  const handleAlaChange = (e, lado) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      const newAla = {
        ...prevState.dimensionesGenerales[lado],
        [name]: value
      };
      
      // Calcular área si tenemos largo y ancho
      if ((name === 'largo' || name === 'ancho') && newAla.largo && newAla.ancho) {
        newAla.area = (parseFloat(newAla.largo) * parseFloat(newAla.ancho)).toFixed(2);
      }
      
      return {
        ...prevState,
        dimensionesGenerales: {
          ...prevState.dimensionesGenerales,
          [lado]: newAla
        }
      };
    });
  };

  const addAmbiente = (tipo) => {
    setFormData(prevState => ({
      ...prevState,
      [tipo]: [
        ...prevState[tipo],
        {
          nombre: '',
          dimensiones: {
            largo: '',
            ancho: '',
            alto: '',
            area: ''
          },
          estructura: {
            coberturaLateral: '',
            sosten: '',
            coberturaSuperior: '',
            mangasJaulasManejo: ''
          },
          ambientacion: {
            comederosBebederos: '',
            refugios: '',
            vegetacion: '',
            clima: ''
          },
          observaciones: ''
        }
      ]
    }));
  };

  // Función para manejar la selección de imágenes
  const handleImageChange = async (event) => {
    const files = event.target.files;
    console.log('Imágenes seleccionadas:', files);
    console.log('Cantidad de imágenes:', files.length);
    setSelectedImages(files);
  };

  const uploadFiles = async (file) => {
    const uploadPreset = 'unsigned_preset'; // Tu upload preset de Cloudinary
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    // Validaciones si las necesitas
    
    try {
      let fotos = [];
      if (selectedImages.length > 0) {
        try {
          const uploadPromises = Array.from(selectedImages).map(file => uploadFiles(file));
          const adjuntosUrls = await Promise.all(uploadPromises);
          fotos = adjuntosUrls;
        } catch (error) {
          console.error('Error al subir archivos:', error);
          Swal.fire({
            title: 'Error en la carga de imágenes',
            text: 'No se pudieron subir algunos archivos',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#70AA68',
            allowEnterKey: true,
            customClass: {
              confirmButton: 'custom-swal-button'
            }
          });
          return;
        }
      }

      const recintoData = {
        ...formData,
        fotos
      };

      const response = await axios.post(`${import.meta.env.VITE_API_USUARIO}recintos`, recintoData);
      handleAdd(response.data);
      handleClose();
      
      Swal.fire({
        title: "¡Recinto creado exitosamente!",
        text: "El nuevo recinto ha sido registrado en el sistema",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: '#70AA68',
        allowEnterKey: true,
        customClass: {
          confirmButton: 'custom-swal-button'
        }
      }).then(() => {
        onUpdate && onUpdate();
      });

    } catch (error) {
      console.error('Error detallado al crear recinto:', error);
      
      Swal.fire({
        title: "Error en el registro",
        text: error.response?.data?.message || "Hubo un problema al crear el recinto. Por favor, inténtelo nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: '#70AA68',
        allowEnterKey: true,
        customClass: {
          confirmButton: 'custom-swal-button'
        }
      });
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  // Estilos comunes que podemos reutilizar
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

  // Reemplazar las funciones de preview anteriores
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  // Páginas del formulario
  const renderPage1 = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label style={{ 
          color: '#333333',
          fontWeight: '500'
        }}>
          Nombre del Recinto
        </Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          style={{ 
            backgroundColor: '#D9EAD3',
            border: 'none',
            borderRadius: '4px',
            padding: '10px'
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ 
          color: '#333333',
          fontWeight: '500'
        }}>
          Fecha de Instalación
        </Form.Label>
        <Form.Control
          type="date"
          name="fechaInstalacion"
          value={formData.fechaInstalacion}
          onChange={handleChange}
          style={{ 
            backgroundColor: '#D9EAD3',
            border: 'none',
            borderRadius: '4px',
            padding: '10px'
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ 
          color: '#333333',
          fontWeight: '500'
        }}>
          Código del Recinto
        </Form.Label>
        <Form.Control
          type="text"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          style={{ 
            backgroundColor: '#D9EAD3',
            border: 'none',
            borderRadius: '4px',
            padding: '10px'
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ 
          color: '#333333',
          fontWeight: '500'
        }}>
          Ubicación
        </Form.Label>
        <Form.Control
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          style={{ 
            backgroundColor: '#D9EAD3',
            border: 'none',
            borderRadius: '4px',
            padding: '10px'
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ 
          color: '#333333',
          fontWeight: '500'
        }}>
          Especie
        </Form.Label>
        <Form.Control
          type="text"
          name="especie"
          value={formData.especie}
          onChange={handleChange}
          style={{ 
            backgroundColor: '#D9EAD3',
            border: 'none',
            borderRadius: '4px',
            padding: '10px'
          }}
        />
      </Form.Group>
    </>
  );

  const renderPage2 = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label style={labelStyle}>Número de Individuos Recomendados</Form.Label>
        <Form.Control
          type="number"
          name="numeroIndividuosRecomendados"
          value={formData.numeroIndividuosRecomendados}
          onChange={handleChange}
          style={inputStyle}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={labelStyle}>Descripción del Recinto</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descripcionRecinto"
          value={formData.descripcionRecinto}
          onChange={handleChange}
          style={inputStyle}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={labelStyle}>Condiciones Ambientales</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="condicionesAmbientales"
          value={formData.condicionesAmbientales}
          onChange={handleChange}
          style={inputStyle}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={labelStyle}>Condiciones de Bioseguridad</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="condicionesBioseguridad"
          value={formData.condicionesBioseguridad}
          onChange={handleChange}
          style={inputStyle}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={labelStyle}>Calidad Didáctica</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="calidadDidactica"
          value={formData.calidadDidactica}
          onChange={handleChange}
          style={inputStyle}
        />
      </Form.Group>
    </>
  );

  const renderPage3 = () => (
    <>
      <h5 style={labelStyle}>Dimensiones Generales</h5>
      <Row className="mb-4">
        <Col>
          <Form.Control
            type="number"
            name="largo"
            placeholder="Largo"
            value={formData.dimensionesGenerales.largo}
            onChange={handleDimensionesChange}
            style={inputStyle}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="ancho"
            placeholder="Ancho"
            value={formData.dimensionesGenerales.ancho}
            onChange={handleDimensionesChange}
            style={inputStyle}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="alto"
            placeholder="Alto"
            value={formData.dimensionesGenerales.alto}
            onChange={handleDimensionesChange}
            style={inputStyle}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="area"
            placeholder="Área"
            value={formData.dimensionesGenerales.area}
            readOnly
            style={{...inputStyle, backgroundColor: '#e9ecef'}}
          />
        </Col>
      </Row>

      <h5 style={labelStyle}>Ala Izquierda</h5>
      <Row className="mb-4">
        <Col>
          <Form.Control
            type="number"
            name="largo"
            placeholder="Largo"
            value={formData.dimensionesGenerales.alaIzquierda.largo}
            onChange={(e) => handleAlaChange(e, 'alaIzquierda')}
            style={inputStyle}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="ancho"
            placeholder="Ancho"
            value={formData.dimensionesGenerales.alaIzquierda.ancho}
            onChange={(e) => handleAlaChange(e, 'alaIzquierda')}
            style={inputStyle}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="alto"
            placeholder="Alto"
            value={formData.dimensionesGenerales.alaIzquierda.alto}
            onChange={(e) => handleAlaChange(e, 'alaIzquierda')}
            style={inputStyle}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="area"
            placeholder="Área"
            value={formData.dimensionesGenerales.alaIzquierda.area}
            readOnly
            style={{...inputStyle, backgroundColor: '#e9ecef'}}
          />
        </Col>
      </Row>

      <h5 style={labelStyle}>Ala Derecha</h5>
      <Row>
        <Col>
          <Form.Control
            type="number"
            name="largo"
            placeholder="Largo"
            value={formData.dimensionesGenerales.alaDerecha.largo}
            onChange={(e) => handleAlaChange(e, 'alaDerecha')}
            style={inputStyle}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="ancho"
            placeholder="Ancho"
            value={formData.dimensionesGenerales.alaDerecha.ancho}
            onChange={(e) => handleAlaChange(e, 'alaDerecha')}
            style={inputStyle}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="alto"
            placeholder="Alto"
            value={formData.dimensionesGenerales.alaDerecha.alto}
            onChange={(e) => handleAlaChange(e, 'alaDerecha')}
            style={inputStyle}
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="area"
            placeholder="Área"
            value={formData.dimensionesGenerales.alaDerecha.area}
            readOnly
            style={{...inputStyle, backgroundColor: '#e9ecef'}}
          />
        </Col>
      </Row>
    </>
  );

  const renderPage4 = () => (
    <>
      <h5 style={labelStyle}>Ambientes Externos</h5>
      {formData.ambientesExternos.map((ambiente, index) => (
        <div key={index} className="mb-3">
          <h6 style={labelStyle}>Ambiente {index + 1}</h6>
          <Form.Group>
            <Form.Label style={labelStyle}>Nombre</Form.Label>
            <Form.Control
              type="text"
              name={`nombre-${index}`}
              value={ambiente.nombre}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'nombre')}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Label style={labelStyle}>Dimensiones</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="number"
                name={`largo-${index}`}
                placeholder="Largo"
                value={ambiente.dimensiones.largo}
                onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'dimensiones', 'largo')}
                style={inputStyle}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`ancho-${index}`}
                placeholder="Ancho"
                value={ambiente.dimensiones.ancho}
                onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'dimensiones', 'ancho')}
                style={inputStyle}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`alto-${index}`}
                placeholder="Alto"
                value={ambiente.dimensiones.alto}
                onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'dimensiones', 'alto')}
                style={inputStyle}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`area-${index}`}
                placeholder="Área"
                value={ambiente.dimensiones.area}
                onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'dimensiones', 'area')}
                style={inputStyle}
              />
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label style={labelStyle}>Estructura</Form.Label>
            <Form.Control
              as="textarea"
              name={`coberturaLateral-${index}`}
              placeholder="Cobertura Lateral"
              value={ambiente.estructura.coberturaLateral}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'estructura', 'coberturaLateral')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`sosten-${index}`}
              placeholder="Sosten"
              className="mt-2"
              value={ambiente.estructura.sosten}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'estructura', 'sosten')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`coberturaSuperior-${index}`}
              placeholder="Cobertura Superior"
              className="mt-2"
              value={ambiente.estructura.coberturaSuperior}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'estructura', 'coberturaSuperior')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`mangasJaulasManejo-${index}`}
              placeholder="Mangas Jaulas Manejo"
              className="mt-2"
              value={ambiente.estructura.mangasJaulasManejo}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'estructura', 'mangasJaulasManejo')}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label style={labelStyle}>Ambientación</Form.Label>
            <Form.Control
              as="textarea"
              name={`comederosBebederos-${index}`}
              placeholder="Comederos y Bebederos"
              value={ambiente.ambientacion.comederosBebederos}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'ambientacion', 'comederosBebederos')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`refugios-${index}`}
              placeholder="Refugios"
              className="mt-2"
              value={ambiente.ambientacion.refugios}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'ambientacion', 'refugios')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`vegetacion-${index}`}
              placeholder="Vegetación"
              className="mt-2"
              value={ambiente.ambientacion.vegetacion}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'ambientacion', 'vegetacion')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`clima-${index}`}
              placeholder="Clima"
              className="mt-2"
              value={ambiente.ambientacion.clima}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'ambientacion', 'clima')}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label style={labelStyle}>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name={`observaciones-${index}`}
              value={ambiente.observaciones}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'observaciones')}
              style={inputStyle}
            />
          </Form.Group>
        </div>
      ))}

      <Button 
        variant="outline-success" 
        onClick={() => addAmbiente('ambientesExternos')}
        style={{
          backgroundColor: 'white',
          borderColor: '#70AA68',
          color: '#70AA68',
          borderRadius: '8px',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fa';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <i className="fas fa-plus"></i> Agregar Ambiente Externo
      </Button>
    </>
  );

  const renderPage5 = () => (
    <>
      <h5 style={labelStyle}>Ambientes Internos</h5>
      {formData.ambientesInternos.map((ambiente, index) => (
        <div key={index} className="mb-3">
          <h6 style={labelStyle}>Ambiente {index + 1}</h6>
          <Form.Group>
            <Form.Label style={labelStyle}>Nombre</Form.Label>
            <Form.Control
              type="text"
              name={`nombre-${index}`}
              value={ambiente.nombre}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'nombre')}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Label style={labelStyle}>Dimensiones</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="number"
                name={`largo-${index}`}
                placeholder="Largo"
                value={ambiente.dimensiones.largo}
                onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'dimensiones', 'largo')}
                style={inputStyle}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`ancho-${index}`}
                placeholder="Ancho"
                value={ambiente.dimensiones.ancho}
                onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'dimensiones', 'ancho')}
                style={inputStyle}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`alto-${index}`}
                placeholder="Alto"
                value={ambiente.dimensiones.alto}
                onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'dimensiones', 'alto')}
                style={inputStyle}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`area-${index}`}
                placeholder="Área"
                value={ambiente.dimensiones.area}
                onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'dimensiones', 'area')}
                style={inputStyle}
              />
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label style={labelStyle}>Estructura</Form.Label>
            <Form.Control
              as="textarea"
              name={`coberturaLateral-${index}`}
              placeholder="Cobertura Lateral"
              value={ambiente.estructura.coberturaLateral}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'estructura', 'coberturaLateral')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`sosten-${index}`}
              placeholder="Sosten"
              className="mt-2"
              value={ambiente.estructura.sosten}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'estructura', 'sosten')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`coberturaSuperior-${index}`}
              placeholder="Cobertura Superior"
              className="mt-2"
              value={ambiente.estructura.coberturaSuperior}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'estructura', 'coberturaSuperior')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`mangasJaulasManejo-${index}`}
              placeholder="Mangas Jaulas Manejo"
              className="mt-2"
              value={ambiente.estructura.mangasJaulasManejo}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'estructura', 'mangasJaulasManejo')}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label style={labelStyle}>Ambientación</Form.Label>
            <Form.Control
              as="textarea"
              name={`comederos-${index}`}
              placeholder="Comederos"
              value={ambiente.ambientacion.comederos}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'ambientacion', 'comederos')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`refugios-${index}`}
              placeholder="Refugios"
              className="mt-2"
              value={ambiente.ambientacion.refugios}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'ambientacion', 'refugios')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`vegetacion-${index}`}
              placeholder="Vegetación"
              className="mt-2"
              value={ambiente.ambientacion.vegetacion}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'ambientacion', 'vegetacion')}
              style={inputStyle}
            />
            <Form.Control
              as="textarea"
              name={`clima-${index}`}
              placeholder="Clima"
              className="mt-2"
              value={ambiente.ambientacion.clima}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'ambientacion', 'clima')}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label style={labelStyle}>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name={`observaciones-${index}`}
              value={ambiente.observaciones}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'observaciones')}
              style={inputStyle}
            />
          </Form.Group>
        </div>
      ))}

      <Button 
        variant="outline-success" 
        onClick={() => addAmbiente('ambientesInternos')}
        style={{
          backgroundColor: 'white',
          borderColor: '#70AA68',
          color: '#70AA68',
          borderRadius: '8px',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fa';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <i className="fas fa-plus"></i> Agregar Ambiente Interno
      </Button>
    </>
  );

  const renderPage6 = () => (
    <>
      <div className="text-center mb-4">
        <h4 style={{ fontSize: '24px', color: '#333' }}>
          Fotos del Recinto
        </h4>
      </div>

      <Form.Group className="mt-2">
        <div 
          style={{
            border: '2px dashed #70AA68',
            borderRadius: '8px',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            backgroundColor: '#f8f9fa'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ marginBottom: '10px' }}>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '48px', color: '#70AA68' }}></i>
          </div>

          <div style={{ color: '#70AA68', fontSize: '16px', marginBottom: '8px' }}>
            Haga clic o arrastre las fotos aquí
          </div>

          <div style={{ color: '#666', fontSize: '14px' }}>
            Formatos permitidos: JPG, PNG, GIF
          </div>

          <Form.Control
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {selectedImages.length > 0 && (
          <div className="mt-3">
            <h5 style={{ color: '#333' }}>Vista previa:</h5>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px',
              marginTop: '10px' 
            }}>
              {lightboxImages.map((image, index) => (
                <div 
                  key={index}
                  style={{
                    position: 'relative',
                    width: '150px',
                    height: '150px'
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onClick={() => openLightbox(index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newFiles = Array.from(selectedImages).filter((_, i) => i !== index);
                      const dataTransfer = new DataTransfer();
                      newFiles.forEach(file => dataTransfer.items.add(file));
                      setSelectedImages(dataTransfer.files);
                    }}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: 'rgba(255, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 1
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Form.Group>

      {/* Reemplazar el Modal anterior por el Lightbox */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={currentImageIndex}
        slides={lightboxImages}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
        }}
      />
    </>
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Recinto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {page === 1 && renderPage1()}
          {page === 2 && renderPage2()}
          {page === 3 && renderPage3()}
          {page === 4 && renderPage4()}
          {page === 5 && renderPage5()}
          {page === 6 && renderPage6()}

          <div className="d-flex justify-content-between mt-4">
            {page === 1 ? (
              <Button 
                variant="outline-danger" 
                onClick={handleClose}
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
            ) : (
              <Button 
                variant="outline-secondary" 
                onClick={handlePrevious}
                style={{
                  backgroundColor: 'white',
                  borderColor: '#6c757d',
                  color: '#6c757d',
                  borderRadius: '8px',
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <i className="fas fa-arrow-left"></i> Anterior
              </Button>
            )}
            
            <Button 
              variant="success" 
              onClick={page === 6 ? handleSubmit : handleNext}
              disabled={uploading}
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
              {page === 6 ? (
                <>Guardar</>
              ) : (
                <>Siguiente <i className="fas fa-arrow-right"></i></>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddOfferModal;
