const express = require('express');

const router = express.Router();
const { ValidateJWT, validate } = require('../services/utils');
const {
    validateRules,
    SignUp,
    Login,
    getAllUsers,
} = require('../controllers/auth.controller');

router.post('/signup', validateRules('SignUp'), validate, SignUp);

router.post('/login', validateRules('login'), validate, Login);

router.get('/users', ValidateJWT, getAllUsers);

module.exports = router;
