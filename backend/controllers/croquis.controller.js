const cloudinary = require('cloudinary').v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Subir croquis a Cloudinary
const subirCroquis = async (req, res) => {
  try {
    const file = req.files.croquis; // Asegúrate de que el archivo se pase como 'croquis'
    const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'static/croquis', // Carpeta donde se almacenarán los croquis
    });

    res.status(201).json({
      message: 'Croquis subido correctamente',
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });
  } catch (error) {
    console.error('Error al subir croquis:', error);
    res.status(500).json({ message: 'Error al subir croquis' });
  }
};

// Eliminar croquis de Cloudinary
const eliminarCroquis = async (req, res) => {
  try {
    const { public_id } = req.body; // El ID público del archivo en Cloudinary

    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ message: 'Croquis eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar croquis:', error);
    res.status(500).json({ message: 'Error al eliminar croquis' });
  }
};

// Obtener croquis de la carpeta 'recintos/croquis'
const obtenerCroquis = async (req, res) => {
  try {
    const resources = await cloudinary.search
      .expression('folder:static/croquis')
      .sort_by('public_id', 'desc')
      .max_results(10)
      .execute();

    const croquis = resources.resources.map(file => ({
      url: file.secure_url,
      public_id: file.public_id
    }));

    res.status(200).json(croquis);
  } catch (error) {
    console.error('Error al obtener croquis:', error);
    res.status(500).json({ message: 'Error al obtener croquis' });
  }
};

module.exports = { subirCroquis, eliminarCroquis , obtenerCroquis };
