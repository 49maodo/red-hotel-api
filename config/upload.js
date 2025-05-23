const multer = require('multer');

// Configuration de multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Extension de fichier non supportée. Veuillez télécharger un fichier JPG, JPEG ou PNG.'), false);
    }
};

const uploadHotel = multer({ storage, fileFilter });
const uploadUser = multer({ storage, fileFilter });

module.exports = { uploadHotel, uploadUser };