const express = require('express');
const router = express.Router();
const { Register, Login, getUser, Logout } = require('../controller/auth.controller');

// Route d'inscription
router.post('/register',Register);
// router.post('/register', async (req, res) => {
    
// });

router.post('/login', Login);
router.get('/user', getUser);
router.post('/logout', Logout);



// Exporter le routeur
module.exports = router;
