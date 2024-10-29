const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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
            // sameSite: 'strict',
            sameSite: 'None',
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
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "None",
        maxAge: 0,
    })
    res.json({ message: 'Déconnexion réussie' });
}

// Créer le transporteur nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// 1. Demander la réinitialisation du mot de passe
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Générer un token de réinitialisation
        const resetToken = generateResetToken();

        // Enregistrer le token et sa date d'expiration dans la base de données
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
        await user.save();

        // Lien de réinitialisation
        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

        // Envoyer le lien par e-mail
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Réinitialisation de mot de passe',
            html: `<p>Bonjour,</p>
                 <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe. Ce lien est valide pendant une heure.</p>
                 <a href="${resetUrl}">Réinitialiser le mot de passe</a>
                 <p>Si vous n'avez pas demandé cette action, ignorez cet e-mail.</p>`
        });

        res.status(200).json({ message: 'Lien de réinitialisation envoyé par e-mail' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// 2. Réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
    const { token, motDePasse } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(404).json({ message: 'Token invalide ou expiré' });
        }

        // Mise à jour du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);
        user.motDePasse = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
