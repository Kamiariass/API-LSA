// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Función para generar el Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // El token expira en 30 días
    });
};

// Middleware para proteger rutas (verifica el token)
const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Obtener el token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificar y decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Guardar el ID de usuario en la solicitud
            req.userId = decoded.id; 

            next();
        } catch (error) {
            console.error(error);
            // 401: No autorizado
            res.status(401).json({ message: 'No autorizado, token inválido o expirado' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, token no encontrado en el encabezado' });
    }
};

module.exports = { generateToken, protect };