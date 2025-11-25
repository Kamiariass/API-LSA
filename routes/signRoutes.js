// routes/signRoutes.js
const express = require('express');
const { getSigns, getSignById, createSign, updateSign, deleteSign } = require('../controllers/signController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware'); 
const router = express.Router();

// ------------------------------------------------------------------
// RUTAS PÚBLICAS
// ------------------------------------------------------------------

// GET /api/signs (Obtener todas las señas, con filtros/búsqueda)
router.route('/').get(getSigns);

// GET /api/signs/:id (Obtener una seña por ID)
router.route('/:id').get(getSignById);


// ------------------------------------------------------------------
// RUTAS PRIVADAS
// ------------------------------------------------------------------

// POST /api/signs (Crear una nueva seña con imagen)
router.route('/')
    .post(protect, upload.single('image'), createSign); 

// PUT /api/signs/:id (Actualizar una seña)
// DELETE /api/signs/:id (Eliminar una seña)
router.route('/:id')
    .put(protect, updateSign)
    .delete(protect, deleteSign);

module.exports = router;