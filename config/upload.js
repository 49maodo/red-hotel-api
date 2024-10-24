const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Créer les dossiers s'ils n'existent pas déjà
const userUploadPath = path.join(__dirname, '../uploads/users');
const hotelUploadPath = path.join(__dirname, '../uploads/hotels');

if (!fs.existsSync(userUploadPath)) {
    fs.mkdirSync(userUploadPath, { recursive: true });
}

if (!fs.existsSync(hotelUploadPath)) {
    fs.mkdirSync(hotelUploadPath, { recursive: true });
}

// Filtrer les fichiers : accepter uniquement les images JPG, JPEG, PNG
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accepter le fichier
    } else {
        cb(new Error('Extension de fichier non supportée. Veuillez télécharger un fichier JPG, JPEG ou PNG.'), false); // Refuser le fichier
    }
};

// Configurer le stockage pour les utilisateurs
const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, userUploadPath); // Dossier pour les images des utilisateurs
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Renommer le fichier
    },
});

// Configurer le stockage pour les hôtels
const hotelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, hotelUploadPath); // Dossier pour les images des hôtels
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Renommer le fichier
    },
});

// Middleware d'upload pour les utilisateurs
const uploadUser = multer({
    storage: userStorage,
    fileFilter // Ajout du fileFilter pour filtrer les fichiers par extension
});

// Middleware d'upload pour les hôtels
const uploadHotel = multer({
    storage: hotelStorage,
    fileFilter // Ajout du fileFilter pour les hôtels aussi
});

// Exporter les middlewares
module.exports = { uploadUser, uploadHotel };
