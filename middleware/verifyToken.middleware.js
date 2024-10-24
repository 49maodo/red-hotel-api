const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token du header

    if (!token) {
        return res.status(403).json({ message: 'Aucun token fourni' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        req.userId = decoded.id; // Stocker l'ID de l'utilisateur dans la requête
        next(); // Passer au middleware suivant
    });
};

module.exports = verifyToken;