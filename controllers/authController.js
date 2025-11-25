const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

const registerUser = async (req, res) => {
    const { username, password } = req.body;

    // Validación: Campos obligatorios
    if (!username || !password) {
        return res.status(400).json({ message: '❌ Error: Nombre de usuario y contraseña son obligatorios.' });
    }

    try {
        const userExists = await User.findOne({ username });
        
        // Validación: Usuario ya existe
        if (userExists) {
            return res.status(400).json({ message: '❌ Error: El nombre de usuario ya está en uso.' });
        }

        const user = await User.create({ username, password });
        
        // Genera y devuelve el token al usuario
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor al registrar el usuario.' });
    }
};

// @desc    Autenticar un usuario (login)
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        // Verifica si el usuario existe y si la contraseña coincide
        if (user && (await user.matchPassword(password))) {
            // Si funciona, devuelve el token
            res.json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id),
            });
        } else {
            // No autorizado
            res.status(401).json({ message: '❌ Error: Credenciales inválidas (usuario o contraseña incorrectos).' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor al intentar iniciar sesión.' });
    }
};

module.exports = { registerUser, authUser };