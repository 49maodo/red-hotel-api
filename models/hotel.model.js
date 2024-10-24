const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    email: { type: String, required: true },
    numTel: { type: String, required: true },
    prix: { type: Number, required: true },
    devise: { type: String, enum: ['XOF', 'Euro', 'Dollar'], required: true },
    image: { type: String, required: true }, // URL de l'image
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur connecté
}, { timestamps: true });
const Hotel = mongoose.model('Hotel', HotelSchema);
module.exports = Hotel