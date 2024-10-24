const mongoose = require('mongoose');

// Définition du schéma de l'utilisateur
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
        unique: true // Pour éviter les emails en double
    },
    motDePasse: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Ajout de l'option timestamps

// Création du modèle User
const User = mongoose.model('User', userSchema);

module.exports = User;
