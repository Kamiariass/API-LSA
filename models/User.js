const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// Método para verificar la contraseña
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);