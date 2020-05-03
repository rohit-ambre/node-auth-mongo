const express = require('express');

const router = express.Router();

const {
    validateRules,
    SignUp,
    validate,
    Login,
    getAllUsers,
} = require('../controllers/auth.controller');

const { ValidateJWT } = require('../services/auth.utils');

router.post('/signup', validateRules('SignUp'), validate, SignUp);

router.post('/login', validateRules('login'), validate, Login);

router.get('/users', ValidateJWT, getAllUsers);

module.exports = router;
