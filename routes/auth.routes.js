const express = require('express');
const router = express.Router();

const userController = require('../controllers/auth.controller')

router.post('/signup', userController.SignUp);

router.post('/login', userController.Login)


module.exports = router;