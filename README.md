# 🏨 Red Hotel API

Red Hotel est une API RESTful qui permet aux utilisateurs de s'inscrire, se connecter, gérer leurs hôtels (CRUD), uploader des images vers Cloudinary, et réinitialiser leur mot de passe par e-mail.  
Le projet utilise **Node.js**, **Express.js**, **MongoDB**, **JWT**, **Cloudinary**, et la documentation est intégrée via **Swagger**.

---

## 🚀 Fonctionnalités

- Authentification des utilisateurs (register, login, logout)
- Middleware de protection via JWT (auth)
- CRUD des hôtels (créer, lire, mettre à jour, supprimer)
- Upload d’images vers Cloudinary
- Réinitialisation du mot de passe par e-mail
- Cookies HTTP sécurisés
- Documentation Swagger (http://localhost:8000/api-docs)

---

## 🛠️ Technologies utilisées

- Node.js / Express.js
- MongoDB / Mongoose
- JWT (authentification)
- Cloudinary (upload d’images)
- Multer (upload local)
- Nodemailer (email)
- Swagger (documentation API)

---

## 📦 Installation

1. **Cloner le projet**
   ```bash

   git clone https://github.com/49maodo/red-hotel-api.git
   cd red-hotel-api

   ```
2. **Installer les dépendances**
   ```bash

   npm install

   ```
3. **Configurer les variables d’environnement**
 - Créer un fichier .env à la racine du projet, basé sur .env.example
   ```bash

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    SECRET_KEY=production
    EMAIL=youremail@gmail.com
    EMAIL_PASSWORD=your_gmail_app_password
    FRONTEND_URL=http://localhost:3000

   ```
4- Démarrer le serveur
   ```bash
    npm run start
   ```
   ```bash
    npm run dev
   ```
  
- Par défaut, le serveur tourne sur http://localhost:8000
- Authentification
Utilise un cookie HTTP-only nommé token pour stocker le JWT.
secure: true si SECRET_KEY=production (requiert HTTPS).
Swagger supporte le header d'autorisation (bearerAuth), mais la vraie auth fonctionne par cookie.

- Documentation Swagger
Une fois le serveur lancé, accède à la documentation interactive via :
👉 http://localhost:8000/api-docs