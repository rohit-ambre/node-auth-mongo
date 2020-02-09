const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const userController = require('../controllers/auth.controller');
const { ValidateJWT } = require('../services/auth.utils');

router.post('/signup', userController.validate('SignUp'), userController.SignUp);

router.post('/login', body('email', 'Invalid email').exists().isEmail(), userController.Login);

router.get('/users', ValidateJWT, userController.getAllUsers);


module.exports = router;