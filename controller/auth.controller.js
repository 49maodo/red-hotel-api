const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Route d'authentification
module.exports.Register = async (req, res) => {
    const { nom, prenom, email, motDePasse } = req.body;

    // Validation des champs
    if (!nom || !prenom || !email || !motDePasse) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
        }

        const hashedPassword = await bcrypt.hash(motDePasse, 10);
        // Créer un nouvel utilisateur
        const user = new User({
            nom,
            prenom,
            email,
            motDePasse: hashedPassword
        });

        // Sauvegarder l'utilisateur dans la base de données
        await user.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Email invalide' });
        }
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
module.exports.Login = async (req, res) => {
    const { email, motDePasse } = req.body;

    // Validation des champs
    if (!email || !motDePasse) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
        // Trouver l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Créer un token JWT
        const token = jwt.sign({ id: user._id, email: user.email, nom: user.nom, prenom: user.prenom }, process.env.JWT_SECRET);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.SECRET_KEY === 'production',
            sameSite: 'strict',
            // sameSite: 'None',
            maxAge: 3600000 * 24,//1 jour
        })
        // Connexion réussie
        res.json({ message: 'Connexion réussie', token: token });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
module.exports.getUser = async (req, res) => {
    const cookie = req.cookies['token']
    if (!cookie) {
        return res.status(403).json({ message: 'Aucun token de connexion' });
    }
    jwt.verify(cookie, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token de connexion invalide' });
        }
        res.json({ user: user })
    })
    // res.send(cookie)
}
module.exports.Logout = function (req, res) {
    res.cookie('token', '', {
        maxAge: 0, // Permet de déconnecter l'utilisateur immédiatement
    })
    res.json({ message: 'Déconnexion réussie' });
}