// models/Sign.js
const mongoose = require('mongoose');

const SignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: true, // Único y obligatorio
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['abecedario', 'numeros', 'saludos', 'otros'], // Validación de categoría
        default: 'abecedario'
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=LSA+Se%C3%B1a'
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Campos createdAt y updatedAt
});

module.exports = mongoose.model('Sign', SignSchema);