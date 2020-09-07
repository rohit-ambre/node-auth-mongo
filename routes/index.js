const express = require('express');

const router = express.Router();

const auth_routes = require('./auth.routes');
const user_routes = require('./user.routes');

// Auth routes
router.use('/auth', auth_routes);

// User Routes
router.use('/auth', user_routes);

module.exports = router;
