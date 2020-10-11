const express = require('express');

const router = express.Router();
const { validate } = require('../services/utils');
const {
  validateRules,
  SignUp,
  Login,
} = require('../controllers/auth.controller');

router.post('/signup', validateRules('SignUp'), validate, SignUp);

router.post('/login', validateRules('login'), validate, Login);

module.exports = router;
