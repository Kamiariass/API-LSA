// middleware/multerMiddleware.js
const multer = require('multer');
const path = require('path');

// Configuración de Almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Carpeta 'uploads/' en la raíz del proyecto
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Nombre de archivo único: nombre-timestamp.ext
        cb(null, file.originalname.split('.')[0] + '-' + Date.now() + path.extname(file.originalname));
    },
});

// Filtro: Solo permite imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Inicialización de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

module.exports = upload;