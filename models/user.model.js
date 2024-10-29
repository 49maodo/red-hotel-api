const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    motDePasse: {
        type: String,
        required: true
    },
    resetPasswordToken: String, 
    resetPasswordExpires: Date,
}, { timestamps: true }); 



const User = mongoose.model('User', userSchema);

module.exports = User;
