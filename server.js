// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Cargar variables de entorno del archivo .env
dotenv.config();

// Rutas de la API
const signRoutes = require('./routes/signRoutes');
const authRoutes = require('./routes/authRoutes');

// 🔗 Función para Conectar a MongoDB Atlas
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlas Conectado...');
    } catch (error) {
        console.error(`❌ Error de Conexión a DB: ${error.message}`);
        process.exit(1); 
    }
};

connectDB();

const app = express();

// --- Middlewares Globales ---
app.use(cors());
// Body parser: Permite leer datos JSON
app.use(express.json()); 

// --- Configuración de Archivos Estáticos ---
// Sirve archivos estáticos (index.html) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Servir la carpeta de subidas de Multer (hace que /uploads/image.jpg sea accesible)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta Raíz ('/') para servir el HTML de la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Definición de Rutas de la API ---
app.use('/api/auth', authRoutes); 
app.use('/api/signs', signRoutes); 

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌍 Servidor LSA corriendo en http://localhost:${PORT}`));