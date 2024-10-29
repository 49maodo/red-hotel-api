const express = require('express');
const router = express.Router();
const { Register, Login, getUser, Logout, requestPasswordReset, resetPassword } = require('../controller/auth.controller');


router.post('/register',Register);

    


router.post('/login', Login);
router.get('/user', getUser);
router.post('/logout', Logout);
router.post('/password-reset', requestPasswordReset);
router.post('/password-confirm', resetPassword);



module.exports = router;
