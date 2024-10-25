const express = require('express');
const router = express.Router();
const { uploadHotel } = require('../config/upload');
const Hotel = require('../models/hotel.model');
const { protect } = require('../middleware/auth');
const path = require('path');
const multer = require('multer');


router.get('/', protect, async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des hôtels.', error });
    }
});
// router.post('/create', protect, uploadHotel.single('image'), async (req, res) => {
//     const { nom, adresse, email, numTel, prix, devise } = req.body;
//     const image = req.file ? `/uploads/hotels/${path.basename(req.file.path)}` : null;
//     const user = req.user.id; 

//     // Validation des champs
//     if (!nom || !adresse || !email || !numTel || !prix || !devise || !image) {
//         return res.status(400).json({ message: 'Tous les champs sont requis' });
//     }

//     try {
//         // Vérifier si l'hôtel existe déjà
//         const existingHotel = await Hotel.findOne({ nom, adresse });
//         if (existingHotel) {
//             return res.status(400).json({ message: 'L\'hôtel existe déjà' });
//         }

//         // Créer un nouvel hôtel
//         const hotel = new Hotel({
//             nom,
//             adresse,
//             email,
//             numTel,
//             prix,
//             devise,
//             image,
//             user // Associer l'utilisateur connecté
//         });

//         await hotel.save();

//         res.status(201).json({ message: 'Hôtel créé avec succès', hotel });
//     } catch (error) {
//         console.error('Erreur lors de la création de l\'hôtel:', error);
//         res.status(500).json({ message: 'Erreur serveur', user: req.user._id });
//     }
// });

router.post('/create', protect, (req, res, next) => {
    uploadHotel.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Erreurs liées à multer (par exemple limite de fichier)
            return res.status(400).json({ message: 'Erreur liée à l\'upload du fichier.' });
        } else if (err) {
            // Si l'erreur provient du fileFilter (extension non autorisée)
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    const { nom, adresse, email, numTel, prix, devise } = req.body;
    const user = req.user.id;

    try {
        // Vérifier si le fichier a été rejeté par fileFilter
        if (!req.file) {
            return res.status(400).json({ message: 'Veuillez télécharger un fichier au format JPG, JPEG ou PNG.' });
        }

        const image = `/uploads/hotels/${path.basename(req.file.path)}`;

        // Validation des champs
        if (!nom || !adresse || !email || !numTel || !prix || !devise || !image || !user) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }
        if (devise != 'XOF' && devise != 'Euro' && devise != 'Dollar') {
            return res.status(400).json({ message: 'Veuillez entrer une devise valide (XOF, Euro, Dollar).' });
        }

        const existingHotel = await Hotel.findOne({ nom, adresse });
        if (existingHotel) {
            return res.status(400).json({ message: 'L\'hôtel existe déjà' });
        }

        const hotel = new Hotel({
            nom,
            adresse,
            email,
            numTel,
            prix,
            devise,
            image,
            user
        });

        await hotel.save();

        res.status(201).json({ message: 'Hôtel créé avec succès', hotel });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Email invalide' });
        }
        console.error('Erreur lors de la création de l\'hôtel:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;