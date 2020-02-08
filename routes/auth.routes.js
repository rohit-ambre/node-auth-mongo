const express = require('express');
const router = express.Router();

const userController = require('../controllers/auth.controller');
const { ValidateJWT } = require('../services/auth.utils');

router.post('/signup', userController.SignUp);

router.post('/login', userController.Login);

router.get('/users', ValidateJWT, userController.getAllUsers);


module.exports = router;