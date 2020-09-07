const express = require('express');

const router = express.Router();
const { ValidateJWT } = require('../services/utils');
const { getAllUsers } = require('../controllers/auth.controller');

router.get('/users', ValidateJWT, getAllUsers);

module.exports = router;
