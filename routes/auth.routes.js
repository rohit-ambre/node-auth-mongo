const express = require('express');
const router = express.Router();

const userController = require('../controllers/auth.controller')

router.post('/signup', userController.SignUp);


module.exports = router;