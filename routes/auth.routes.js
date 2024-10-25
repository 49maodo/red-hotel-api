const express = require('express');
const router = express.Router();
const { Register, Login, getUser, Logout } = require('../controller/auth.controller');


router.post('/register',Register);

    


router.post('/login', Login);
router.get('/user', getUser);
router.post('/logout', Logout);




module.exports = router;
