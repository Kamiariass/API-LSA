// routes/authRoutes.js
const express = require('express');
const { registerUser, authUser } = require('../controllers/authController'); 
const router = express.Router();

// Rutas Públicas para el registro y login
router.post('/register', registerUser);
router.post('/login', authUser);

module.exports = router;