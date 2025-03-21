import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const EditRecintoModal = ({ show, handleClose, handleEdit, recintoToEdit }) => {
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
    fotos: [], // Almacena URLs de imágenes existentes
  });

  const [selectedImages, setSelectedImages] = useState([]); // Imágenes seleccionadas para subir
  const [uploading, setUploading] = useState(false); // Controla la carga de imágenes
  const [deletedImages, setDeletedImages] = useState([]); // Imágenes eliminadas para manejar el guardado

  useEffect(() => {
    if (recintoToEdit) {
      setFormData({
        ...recintoToEdit,
        fechaInstalacion: recintoToEdit.fechaInstalacion.split('T')[0], // Formatear la fecha
        numeroIndividuosRecomendados: recintoToEdit.numeroIndividuosRecomendados.toString(),
        dimensionesGenerales: {
          ...recintoToEdit.dimensionesGenerales,
          largo: recintoToEdit.dimensionesGenerales.largo?.toString() || '',
          ancho: recintoToEdit.dimensionesGenerales.ancho?.toString() || '',
          alto: recintoToEdit.dimensionesGenerales.alto?.toString() || '',
          area: recintoToEdit.dimensionesGenerales.area?.toString() || '',
          alaIzquierda: {
            ...recintoToEdit.dimensionesGenerales.alaIzquierda,
            largo: recintoToEdit.dimensionesGenerales.alaIzquierda?.largo?.toString() || '',
            ancho: recintoToEdit.dimensionesGenerales.alaIzquierda?.ancho?.toString() || '',
            alto: recintoToEdit.dimensionesGenerales.alaIzquierda?.alto?.toString() || '',
            area: recintoToEdit.dimensionesGenerales.alaIzquierda?.area?.toString() || '',
          },
          alaDerecha: {
            ...recintoToEdit.dimensionesGenerales.alaDerecha,
            largo: recintoToEdit.dimensionesGenerales.alaDerecha?.largo?.toString() || '',
            ancho: recintoToEdit.dimensionesGenerales.alaDerecha?.ancho?.toString() || '',
            alto: recintoToEdit.dimensionesGenerales.alaDerecha?.alto?.toString() || '',
            area: recintoToEdit.dimensionesGenerales.alaDerecha?.area?.toString() || '',
          },
        },
        fotos: recintoToEdit.fotos || [], // Asegurar que el array de fotos existe
      });
      setDeletedImages([]);
      setSelectedImages([]);
    }
  }, [recintoToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDimensionesChange = (e, lado = null) => {
    const { name, value } = e.target;
    if (lado) {
      setFormData((prevState) => ({
        ...prevState,
        dimensionesGenerales: {
          ...prevState.dimensionesGenerales,
          [lado]: {
            ...prevState.dimensionesGenerales[lado],
            [name]: value,
          },
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        dimensionesGenerales: {
          ...prevState.dimensionesGenerales,
          [name]: value,
        },
      }));
    }
  };

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const handleImageUpload = async () => {
    const urls = [];
    const uploadPreset = 'unsigned_preset';
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        urls.push(data.secure_url);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        throw error;
      }
    }
    return urls;
  };

  const handleImageDelete = (url) => {
    setDeletedImages(prevDeleted => [...prevDeleted, url]);
    setFormData(prevState => ({
      ...prevState,
      fotos: prevState.fotos.filter(foto => foto !== url),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedUrls = [];
      if (selectedImages.length > 0) {
        uploadedUrls = await handleImageUpload();
      }

      const dataToSend = {
        ...formData,
        fotos: [...formData.fotos, ...uploadedUrls],
        numeroIndividuosRecomendados: parseInt(formData.numeroIndividuosRecomendados) || 0,
        dimensionesGenerales: {
          largo: parseFloat(formData.dimensionesGenerales.largo) || 0,
          ancho: parseFloat(formData.dimensionesGenerales.ancho) || 0,
          alto: parseFloat(formData.dimensionesGenerales.alto) || 0,
          area: parseFloat(formData.dimensionesGenerales.area) || 0,
          alaIzquierda: {
            largo: parseFloat(formData.dimensionesGenerales.alaIzquierda.largo) || 0,
            ancho: parseFloat(formData.dimensionesGenerales.alaIzquierda.ancho) || 0,
            alto: parseFloat(formData.dimensionesGenerales.alaIzquierda.alto) || 0,
            area: parseFloat(formData.dimensionesGenerales.alaIzquierda.area) || 0,
          },
          alaDerecha: {
            largo: parseFloat(formData.dimensionesGenerales.alaDerecha.largo) || 0,
            ancho: parseFloat(formData.dimensionesGenerales.alaDerecha.ancho) || 0,
            alto: parseFloat(formData.dimensionesGenerales.alaDerecha.alto) || 0,
            area: parseFloat(formData.dimensionesGenerales.alaDerecha.area) || 0,
          },
        },
      };

      const response = await axios.put(`${import.meta.env.VITE_API_USUARIO}recintos/${recintoToEdit._id}`, dataToSend);
      handleEdit(response.data);
      handleClose();

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'El recinto ha sido actualizado correctamente.',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error al actualizar el recinto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el recinto. Por favor, inténtelo de nuevo.',
        confirmButtonText: 'Aceptar',
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

  // Agregar esta nueva función para manejar cambios en campos anidados
  const handleNestedChange = (e, index, arrayName, field, subfield = null) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      const newArray = [...prevState[arrayName]];
      if (subfield) {
        newArray[index] = {
          ...newArray[index],
          [field]: {
            ...newArray[index][field],
            [subfield]: value
          }
        };
      } else {
        newArray[index] = {
          ...newArray[index],
          [field]: value
        };
      }
      return { ...prevState, [arrayName]: newArray };
    });
  };

  // Agregar esta función para añadir nuevos ambientes
  const addAmbiente = (arrayName) => {
    setFormData(prevState => ({
      ...prevState,
      [arrayName]: [
        ...prevState[arrayName],
        {
          nombre: '',
          dimensiones: { largo: '', ancho: '', alto: '', area: '' },
          estructura: { coberturaLateral: '', sosten: '', coberturaSuperior: '', mangasJaulasManejo: '' },
          ambientacion: arrayName === 'ambientesExternos' 
            ? { comederosBebederos: '', refugios: '', vegetacion: '', clima: '' }
            : { comederos: '', refugios: '', vegetacion: '', clima: '' },
          observaciones: ''
        }
      ]
    }));
  };

  // Renderizar las páginas del formulario
  const renderPage1 = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Nombre del Recinto</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Fecha de Instalación</Form.Label>
        <Form.Control
          type="date"
          name="fechaInstalacion"
          value={formData.fechaInstalacion}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Código del Recinto</Form.Label>
        <Form.Control
          type="text"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Ubicación</Form.Label>
        <Form.Control
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Especie</Form.Label>
        <Form.Control
          type="text"
          name="especie"
          value={formData.especie}
          onChange={handleChange}
          required
        />
      </Form.Group>
    </>
  );

  const renderPage2 = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Número de Individuos Recomendados</Form.Label>
        <Form.Control
          type="number"
          name="numeroIndividuosRecomendados"
          value={formData.numeroIndividuosRecomendados}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Descripción del Recinto</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descripcionRecinto"
          value={formData.descripcionRecinto}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Condiciones Ambientales</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="condicionesAmbientales"
          value={formData.condicionesAmbientales}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Condiciones de Bioseguridad</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="condicionesBioseguridad"
          value={formData.condicionesBioseguridad}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Calidad Didáctica</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="calidadDidactica"
          value={formData.calidadDidactica}
          onChange={handleChange}
        />
      </Form.Group>
    </>
  );

  const renderPage3 = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Dimensiones Generales</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="largo"
              placeholder="Largo"
              value={formData.dimensionesGenerales.largo}
              onChange={handleDimensionesChange}
              required
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="ancho"
              placeholder="Ancho"
              value={formData.dimensionesGenerales.ancho}
              onChange={handleDimensionesChange}
              required
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="alto"
              placeholder="Alto"
              value={formData.dimensionesGenerales.alto}
              onChange={handleDimensionesChange}
              required
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="area"
              placeholder="Área"
              value={formData.dimensionesGenerales.area}
              onChange={handleDimensionesChange}
              required
            />
          </Col>
        </Row>
      </Form.Group>

      <h5>Ala Izquierda</h5>
      <Row>
        <Col>
          <Form.Control
            type="number"
            name="largo"
            placeholder="Largo"
            value={formData.dimensionesGenerales.alaIzquierda.largo}
            onChange={(e) => handleDimensionesChange(e, 'alaIzquierda')}
            required
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="ancho"
            placeholder="Ancho"
            value={formData.dimensionesGenerales.alaIzquierda.ancho}
            onChange={(e) => handleDimensionesChange(e, 'alaIzquierda')}
            required
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="alto"
            placeholder="Alto"
            value={formData.dimensionesGenerales.alaIzquierda.alto}
            onChange={(e) => handleDimensionesChange(e, 'alaIzquierda')}
            required
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="area"
            placeholder="Área"
            value={formData.dimensionesGenerales.alaIzquierda.area}
            onChange={(e) => handleDimensionesChange(e, 'alaIzquierda')}
            required
          />
        </Col>
      </Row>

      <h5 className="mt-4">Ala Derecha</h5>
      <Row>
        <Col>
          <Form.Control
            type="number"
            name="largo"
            placeholder="Largo"
            value={formData.dimensionesGenerales.alaDerecha.largo}
            onChange={(e) => handleDimensionesChange(e, 'alaDerecha')}
            required
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="ancho"
            placeholder="Ancho"
            value={formData.dimensionesGenerales.alaDerecha.ancho}
            onChange={(e) => handleDimensionesChange(e, 'alaDerecha')}
            required
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="alto"
            placeholder="Alto"
            value={formData.dimensionesGenerales.alaDerecha.alto}
            onChange={(e) => handleDimensionesChange(e, 'alaDerecha')}
            required
          />
        </Col>
        <Col>
          <Form.Control
            type="number"
            name="area"
            placeholder="Área"
            value={formData.dimensionesGenerales.alaDerecha.area}
            onChange={(e) => handleDimensionesChange(e, 'alaDerecha')}
            required
          />
        </Col>
      </Row>
    </>
  );

  const renderPage4 = () => (
    <>
      <h5>Ambientes Externos</h5>
      {formData.ambientesExternos.map((ambiente, index) => (
        <div key={index} className="mb-3">
          <h6>Ambiente {index + 1}</h6>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name={`nombre-${index}`}
              value={ambiente.nombre}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'nombre')}
            />
          </Form.Group>

          <Form.Label>Dimensiones</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="number"
                name={`largo-${index}`}
                placeholder="Largo"
                value={ambiente.dimensiones.largo}
                onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'dimensiones', 'largo')}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`ancho-${index}`}
                placeholder="Ancho"
                value={ambiente.dimensiones.ancho}
                onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'dimensiones', 'ancho')}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`alto-${index}`}
                placeholder="Alto"
                value={ambiente.dimensiones.alto}
                onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'dimensiones', 'alto')}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`area-${index}`}
                placeholder="Área"
                value={ambiente.dimensiones.area}
                onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'dimensiones', 'area')}
              />
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>Estructura</Form.Label>
            <Form.Control
              as="textarea"
              name={`coberturaLateral-${index}`}
              placeholder="Cobertura Lateral"
              value={ambiente.estructura.coberturaLateral}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'estructura', 'coberturaLateral')}
            />
            <Form.Control
              as="textarea"
              name={`sosten-${index}`}
              placeholder="Sosten"
              className="mt-2"
              value={ambiente.estructura.sosten}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'estructura', 'sosten')}
            />
            <Form.Control
              as="textarea"
              name={`coberturaSuperior-${index}`}
              placeholder="Cobertura Superior"
              className="mt-2"
              value={ambiente.estructura.coberturaSuperior}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'estructura', 'coberturaSuperior')}
            />
            <Form.Control
              as="textarea"
              name={`mangasJaulasManejo-${index}`}
              placeholder="Mangas Jaulas Manejo"
              className="mt-2"
              value={ambiente.estructura.mangasJaulasManejo}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'estructura', 'mangasJaulasManejo')}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Ambientación</Form.Label>
            <Form.Control
              as="textarea"
              name={`comederosBebederos-${index}`}
              placeholder="Comederos y Bebederos"
              value={ambiente.ambientacion.comederosBebederos}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'ambientacion', 'comederosBebederos')}
            />
            <Form.Control
              as="textarea"
              name={`refugios-${index}`}
              placeholder="Refugios"
              className="mt-2"
              value={ambiente.ambientacion.refugios}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'ambientacion', 'refugios')}
            />
            <Form.Control
              as="textarea"
              name={`vegetacion-${index}`}
              placeholder="Vegetación"
              className="mt-2"
              value={ambiente.ambientacion.vegetacion}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'ambientacion', 'vegetacion')}
            />
            <Form.Control
              as="textarea"
              name={`clima-${index}`}
              placeholder="Clima"
              className="mt-2"
              value={ambiente.ambientacion.clima}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'ambientacion', 'clima')}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name={`observaciones-${index}`}
              value={ambiente.observaciones}
              onChange={(e) => handleNestedChange(e, index, 'ambientesExternos', 'observaciones')}
            />
          </Form.Group>
        </div>
      ))}

      <Button variant="secondary" onClick={() => addAmbiente('ambientesExternos')}>
        Agregar Ambiente Externo
      </Button>
    </>
  );

  const renderPage5 = () => (
    <>
      <h5>Ambientes Internos</h5>
      {formData.ambientesInternos.map((ambiente, index) => (
        <div key={index} className="mb-3">
          <h6>Ambiente {index + 1}</h6>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name={`nombre-${index}`}
              value={ambiente.nombre}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'nombre')}
            />
          </Form.Group>

          <Form.Label>Dimensiones</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="number"
                name={`largo-${index}`}
                placeholder="Largo"
                value={ambiente.dimensiones.largo}
                onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'dimensiones', 'largo')}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`ancho-${index}`}
                placeholder="Ancho"
                value={ambiente.dimensiones.ancho}
                onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'dimensiones', 'ancho')}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`alto-${index}`}
                placeholder="Alto"
                value={ambiente.dimensiones.alto}
                onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'dimensiones', 'alto')}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                name={`area-${index}`}
                placeholder="Área"
                value={ambiente.dimensiones.area}
                onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'dimensiones', 'area')}
              />
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>Estructura</Form.Label>
            <Form.Control
              as="textarea"
              name={`coberturaLateral-${index}`}
              placeholder="Cobertura Lateral"
              value={ambiente.estructura.coberturaLateral}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'estructura', 'coberturaLateral')}
            />
            <Form.Control
              as="textarea"
              name={`sosten-${index}`}
              placeholder="Sosten"
              className="mt-2"
              value={ambiente.estructura.sosten}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'estructura', 'sosten')}
            />
            <Form.Control
              as="textarea"
              name={`coberturaSuperior-${index}`}
              placeholder="Cobertura Superior"
              className="mt-2"
              value={ambiente.estructura.coberturaSuperior}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'estructura', 'coberturaSuperior')}
            />
            <Form.Control
              as="textarea"
              name={`mangasJaulasManejo-${index}`}
              placeholder="Mangas Jaulas Manejo"
              className="mt-2"
              value={ambiente.estructura.mangasJaulasManejo}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'estructura', 'mangasJaulasManejo')}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Ambientación</Form.Label>
            <Form.Control
              as="textarea"
              name={`comederos-${index}`}
              placeholder="Comederos"
              value={ambiente.ambientacion.comederos}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'ambientacion', 'comederos')}
            />
            <Form.Control
              as="textarea"
              name={`refugios-${index}`}
              placeholder="Refugios"
              className="mt-2"
              value={ambiente.ambientacion.refugios}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'ambientacion', 'refugios')}
            />
            <Form.Control
              as="textarea"
              name={`vegetacion-${index}`}
              placeholder="Vegetación"
              className="mt-2"
              value={ambiente.ambientacion.vegetacion}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'ambientacion', 'vegetacion')}
            />
            <Form.Control
              as="textarea"
              name={`clima-${index}`}
              placeholder="Clima"
              className="mt-2"
              value={ambiente.ambientacion.clima}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'ambientacion', 'clima')}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name={`observaciones-${index}`}
              value={ambiente.observaciones}
              onChange={(e) => handleNestedChange(e, index, 'ambientesInternos', 'observaciones')}
            />
          </Form.Group>
        </div>
      ))}

      <Button variant="secondary" onClick={() => addAmbiente('ambientesInternos')}>
        Agregar Ambiente Interno
      </Button>
    </>
  );

  const renderPage6 = () => (
    <>
      <Form.Group className="mt-4">
        <Form.Label>Fotos del Recinto</Form.Label>
        {formData.fotos.length > 0 && (
          <div className="d-flex flex-wrap">
            {formData.fotos.map((foto, index) => (
              <Card key={index} className="m-2" style={{ width: '150px' }}>
                <Image
                  src={foto}
                  alt={`Foto ${index + 1}`}
                  thumbnail
                  style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleImageDelete(foto)}
                >
                  Eliminar
                </Button>
              </Card>
            ))}
          </div>
        )}
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
      </Form.Group>
    </>
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Recinto</Modal.Title>
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
            <Button variant="secondary" onClick={handlePrevious} disabled={page === 1}>
              Anterior
            </Button>
            <Button variant="primary" onClick={page === 6 ? handleSubmit : handleNext} disabled={uploading}>
              {uploading ? 'Guardando...' : (page === 6 ? 'Guardar' : 'Siguiente')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditRecintoModal;