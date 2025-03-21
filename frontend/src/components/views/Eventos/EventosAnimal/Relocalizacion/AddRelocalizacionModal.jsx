import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../../../../context/AuthContext';

const AddRelocalizacionModal = ({ show, handleClose, handleAdd }) => {
    const { user } = useContext(AuthContext);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
  
    const [formData, setFormData] = useState({
        animalId: '',
        recintoAnterior: '',
        recintoNuevo: '',
        fechaRelocalizacion: '',
        motivo: '',
        observaciones: '',
        archivos: [],
        realizadoPor: user ? user._id : ''
    });

    const [animales, setAnimales] = useState([]);
    const [recintos, setRecintos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [animalesRes, recintosRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_USUARIO}animales`),
                    axios.get(`${import.meta.env.VITE_API_USUARIO}recintos`)
                ]);
                setAnimales(animalesRes.data);
                setRecintos(recintosRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire('Error', 'No se pudo cargar la información necesaria', 'error');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => 
            file.type === 'application/pdf' || 
            file.type.startsWith('image/')
        );

        if (validFiles.length !== files.length) {
            Swal.fire('Error', 'Solo se permiten archivos PDF e imágenes', 'error');
        }

        setSelectedFiles(validFiles);
    };

    const uploadFileToCloudinary = async (file) => {
        const uploadPreset = 'unsigned_preset'; // Reemplaza con tu upload preset
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error al subir archivo a Cloudinary:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            // Subir archivos a Cloudinary
            const uploadedUrls = await Promise.all(
                selectedFiles.map(file => uploadFileToCloudinary(file))
            );

            // Preparar datos para enviar al backend
            const relocalizacionData = {
                ...formData,
                archivos: uploadedUrls
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_USUARIO}relocalizacion`, 
                relocalizacionData
            );

            handleAdd(response.data);
            handleClose();
            Swal.fire('Éxito', 'Relocalización agregada correctamente', 'success');
        } catch (error) {
            console.error('Error al agregar la relocalización:', error);
            Swal.fire('Error', 'No se pudo agregar la relocalización', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Relocalización</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Animal</Form.Label>
                        <Form.Select name="animalId" onChange={handleChange} required>
                            <option value="">Seleccione un animal</option>
                            {animales.map(animal => (
                                <option key={animal._id} value={animal._id}>{animal.nombreInstitucional}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Recinto Anterior</Form.Label>
                        <Form.Select name="recintoAnterior" onChange={handleChange} required>
                            <option value="">Seleccione un recinto</option>
                            {recintos.map(recinto => (
                                <option key={recinto._id} value={recinto._id}>{recinto.nombre}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Recinto Nuevo</Form.Label>
                        <Form.Select name="recintoNuevo" onChange={handleChange} required>
                            <option value="">Seleccione un recinto</option>
                            {recintos.map(recinto => (
                                <option key={recinto._id} value={recinto._id}>{recinto.nombre}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Relocalización</Form.Label>
                        <Form.Control type="date" name="fechaRelocalizacion" onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Motivo</Form.Label>
                        <Form.Control as="textarea" rows={3} name="motivo" onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Observaciones</Form.Label>
                        <Form.Control as="textarea" rows={3} name="observaciones" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Archivos</Form.Label>
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

                    <Button variant="primary" type="submit" disabled={uploading}>
                        {uploading ? 'Guardando...' : 'Agregar Relocalización'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddRelocalizacionModal;