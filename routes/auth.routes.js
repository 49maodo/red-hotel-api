const express = require('express');
const router = express.Router();
const { Register, Login, getUser, Logout, requestPasswordReset, resetPassword } = require('../controller/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints d'authentification et gestion utilisateur
 */


/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Inscription d’un utilisateur
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - motDePasse
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur inscrit avec succès
 */
router.post('/register', Register);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     tags: [Auth] 
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 */
router.post('/login', Login);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Récupérer les infos de l'utilisateur connecté
 *     tags: [Auth] 
 *     responses:
 *       200:
 *         description: Données utilisateur récupérées
 */
router.get('/user', getUser);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Auth] 
 *     security: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', Logout);

/**
 * @swagger
 * /api/password-reset:
 *   post:
 *     summary: Demande de réinitialisation du mot de passe
 *     tags: [Auth] 
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 */
router.post('/password-reset', requestPasswordReset);

/**
 * @swagger
 * /api/password-confirm:
 *   post:
 *     summary: Confirmation de la réinitialisation du mot de passe
 *     tags: [Auth] 
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 */
router.post('/password-confirm', resetPassword);



module.exports = router;
