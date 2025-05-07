const express = require('express');
const router = express.Router();
const { uploadHotel } = require('../config/upload');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const Hotel = require('../models/hotel.model');
const { protect } = require('../middleware/auth');
const path = require('path');
const multer = require('multer');

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: API pour la gestion des hôtels
 */

/**
 * @swagger
 * /hotel:
 *   get:
 *     summary: Récupérer tous les hôtels d’un utilisateur
 *     tags: [Hotels]
 *     security: 
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des hôtels récupérée avec succès
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *       500:
 *         description: Erreur serveur lors de la récupération des hôtels
 */
router.get('/', protect, async (req, res) => {
    try {
        const hotels = await Hotel.find({ user: req.user.id });
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des hôtels.', error });
    }
});

/**
 * @swagger
 * /hotel/create:
 *   post:
 *     summary: Créer un nouvel hôtel
 *     tags: [Hotels]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - adresse
 *               - email
 *               - numTel
 *               - prix
 *               - devise
 *               - image
 *             properties:
 *               nom:
 *                 type: string
 *               adresse:
 *                 type: string
 *               email:
 *                 type: string
 *               numTel:
 *                 type: string
 *               prix:
 *                 type: number
 *               devise:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Hôtel créé avec succès
 */
router.post('/create', protect, (req, res, next) => {
    uploadHotel.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Erreur liée à l\'upload du fichier.' });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    const { nom, adresse, email, numTel, prix, devise } = req.body;
    const user = req.user.id;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Veuillez télécharger un fichier au format JPG, JPEG ou PNG.' });
        }

        const imageUrl = await uploadToCloudinary(req.file.buffer, 'hotels');

        // Validation des champs
        if (!nom || !adresse || !email || !numTel || !prix || !devise || !imageUrl) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }
        if (devise !== 'XOF' && devise !== 'Euro' && devise !== 'Dollar') {
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
            image: imageUrl,
            user
        });

        await hotel.save();

        res.status(201).json({ message: 'Hôtel créé avec succès', hotel });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Email invalide' });
        }
        console.error('Erreur lors de la création de l\'hôtel:', error);
        res.status(500).json({ message: `Erreur serveur ${error.message}` });
    }
});

/**
 * @swagger
 * /hotel/delete/{id}:
 *   delete:
 *     summary: Supprimer un hôtel
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l’hôtel à supprimer
 *     responses:
 *       200:
 *         description: Hôtel supprimé avec succès
 *       404:
 *         description: Hôtel non trouvé
 */
router.delete('/delete/:id', protect, async (req, res) => {
    const hotelId = req.params.id;

    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hôtel non trouvé' });
        }

        // Supprimer l'image de Cloudinary
        const publicId = hotel.image.split('/').pop().split('.')[0];
        const finalPublicId = `hotels/${publicId}`;
        await deleteFromCloudinary(finalPublicId);

        // Supprimer l'hôtel de la base de données
        await Hotel.findByIdAndDelete(hotelId);

        res.status(200).json({ message: 'Hôtel supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'hôtel:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'hôtel' });
    }
});

/**
 * @swagger
 * /hotel/edit/{id}:
 *   put:
 *     summary: Modifier un hôtel existant
 *     tags: [Hotels]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: require
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l’hôtel
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               adresse:
 *                 type: string
 *               email:
 *                 type: string
 *               numTel:
 *                 type: string
 *               prix:
 *                 type: number
 *               devise:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Hôtel modifié avec succès
 *       404:
 *         description: Hôtel non trouvé
 */
router.put('/edit/:id', protect, (req, res, next) => {
    uploadHotel.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Erreur liée à l\'upload du fichier.' });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    const { nom, adresse, email, numTel, prix, devise } = req.body;

    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hôtel non trouvé' });
        }

        // Vérifiez si une nouvelle image a été téléchargée
        let imageUrl = hotel.image;
        if (req.file) {
            // Supprimer l'ancienne image de Cloudinary
            const publicId = hotel.image.split('/').pop().split('.')[0];
            await deleteFromCloudinary(`hotels/${publicId}`);

            imageUrl = await uploadToCloudinary(req.file.buffer, 'hotels');
        }

        // Mettez à jour les champs de l'hôtel
        hotel.nom = nom || hotel.nom;
        hotel.adresse = adresse || hotel.adresse;
        hotel.email = email || hotel.email;
        hotel.numTel = numTel || hotel.numTel;
        hotel.prix = prix || hotel.prix;
        hotel.devise = devise || hotel.devise;
        hotel.image = imageUrl;

        await hotel.save();

        res.status(200).json({ message: 'Hôtel modifié avec succès', hotel });
    } catch (error) {
        console.error('Erreur lors de la modification de l\'hôtel:', error);
        res.status(500).json({ message: `Erreur serveur: ${error.message}` });
    }
});


module.exports = router;