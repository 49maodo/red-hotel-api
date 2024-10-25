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


const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Extension de fichier non supportée. Veuillez télécharger un fichier JPG, JPEG ou PNG.'), false); // Refuser le fichier
    }
};


const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, userUploadPath); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    },
});


const hotelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, hotelUploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});


const uploadUser = multer({
    storage: userStorage,
    fileFilter
});


const uploadHotel = multer({
    storage: hotelStorage,
    fileFilter 
});


module.exports = { uploadUser, uploadHotel };
