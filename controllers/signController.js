// controllers/signController.js
const Sign = require('../models/Sign');
const mongoose = require('mongoose');

// @desc    Obtener todas las señas. Incluye filtros por categoría y búsqueda por nombre.
// @route   GET /api/signs
// @access  Public
const getSigns = async (req, res) => {
    const { category, search, sort } = req.query;
    let filter = {};
    let sortOption = {};

    // FILTRO 1: Filtrado por Categoría
    if (category) {
        filter.category = category;
    }

    // FILTRO 2 / BÚSQUEDA: Por Nombre (Búsqueda insensible a mayúsculas/minúsculas)
    if (search) {
        filter.name = { $regex: search, $options: 'i' }; 
    }

    // Ordenamiento
    if (sort === 'name_asc') {
        sortOption.name = 1;
    } else if (sort === 'name_desc') {
        sortOption.name = -1;
    }

    try {
        const signs = await Sign.find(filter).sort(sortOption);
        res.json(signs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtener una seña por ID
// @route   GET /api/signs/:id
// @access  Public
const getSignById = async (req, res) => {
    try {
        // Validación: ID de MongoDB
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID de seña inválido.' });
        }
        
        const sign = await Sign.findById(req.params.id);
        
        if (sign) {
            res.json(sign);
        } else {
            res.status(404).json({ message: 'Seña no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al buscar el ID.' });
    }
};

// @desc    Crear una nueva seña (con subida de imagen)
// @route   POST /api/signs
// @access  Private (Protegida por JWT)
const createSign = async (req, res) => {
    const { name, category, description } = req.body;
    let imageUrl = req.body.imageUrl; // Placeholder

    // Lógica Multer: Si se subió un archivo, usa la ruta generada
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    // Validación: El nombre es obligatorio
    if (!name) {
        return res.status(400).json({ message: '❌ Error: El nombre de la seña es obligatorio.' });
    }
    
    try {
        const sign = new Sign({
            name,
            category: category || 'abecedario',
            imageUrl: imageUrl,
            description
        });

        const createdSign = await sign.save();
        res.status(201).json(createdSign);
    } catch (error) {
        // Manejo de error si el nombre ya existe (unique: true)
        if (error.code === 11000) {
            return res.status(400).json({ message: '❌ Error: Ya existe una seña con este nombre.' });
        }
        res.status(500).json({ message: 'Error al crear la seña: ' + error.message });
    }
};

// @desc    Actualizar una seña por ID
// @route   PUT /api/signs/:id
// @access  Private (Protegida por JWT)
const updateSign = async (req, res) => {
    const { name, category, imageUrl, description } = req.body;
    
    try {
        // Validación: ID de MongoDB
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID de seña inválido.' });
        }
        
        const sign = await Sign.findById(req.params.id);

        if (sign) {
            // Actualiza solo los campos proporcionados
            sign.name = name !== undefined ? name : sign.name;
            sign.category = category !== undefined ? category : sign.category;
            sign.imageUrl = imageUrl !== undefined ? imageUrl : sign.imageUrl;
            sign.description = description !== undefined ? description : sign.description;

            // Validación: Prevenir nombre vacío
            if (name !== undefined && name === "") {
                return res.status(400).json({ message: '❌ Error: El nombre no puede estar vacío.' });
            }

            const updatedSign = await sign.save();
            res.json(updatedSign);
        } else {
            res.status(404).json({ message: 'Seña no encontrada para actualizar' });
        }
    } catch (error) {
         // Manejo de error si el nombre actualizado ya existe
         if (error.code === 11000) {
            return res.status(400).json({ message: '❌ Error: Ya existe otra seña con ese nombre actualizado.' });
        }
        res.status(500).json({ message: 'Error al actualizar la seña: ' + error.message });
    }
};

// @desc    Eliminar una seña por ID
// @route   DELETE /api/signs/:id
// @access  Private (Protegida por JWT)
const deleteSign = async (req, res) => {
    try {
        // Validación: ID de MongoDB
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID de seña inválido.' });
        }
        
        const result = await Sign.deleteOne({ _id: req.params.id });
        
        if (result.deletedCount > 0) {
            res.json({ message: 'Seña eliminada correctamente' });
        } else {
            res.status(404).json({ message: 'Seña no encontrada para eliminar' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor al eliminar la seña.' });
    }
};

module.exports = { 
    getSigns, 
    getSignById, 
    createSign, 
    updateSign, 
    deleteSign 
};