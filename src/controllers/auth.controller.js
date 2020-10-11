const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/user.model');
const logger = require('../../winston-config');

exports.validateRules = (method) => {
  switch (method) {
    case 'SignUp': {
      return [
        body('username', "username doesn't exists").exists(),
        body('email')
          .exists()
          .withMessage('email does not exist')
          .isEmail()
          .withMessage('Invalid email'),
        body('first_name', 'enter first name').exists(),
        body('last_name', 'enter last name').exists(),
        body('password')
          .exists()
          .withMessage('password does not exist')
          .isLength({ min: 5 })
          .withMessage('must be at least 5 chars long'),
      ];
    }
    case 'login': {
      return [
        body('email')
          .exists()
          .withMessage('email does not exist')
          .isEmail()
          .withMessage('Invalid email'),
        body('password').exists().withMessage('password does not exist'),
      ];
    }
    default:
  }
};

module.exports.SignUp = (req, res) => {
  User.findOneUser(req.body[User.UNIQUE_FIELD], (err, data) => {
    if (err) {
      logger.error(`DB Error: ${err.message}`);
      res.status(500).json({
        status: false,
        message: 'some error occured',
        error: err,
      });
    }
    if (data) {
      res.status(200).json({
        status: false,
        message: 'User already exist',
      });
    } else {
      const user = new User(req.body);

      user.save((er, new_user) => {
        if (er) {
          logger.error(`DB Error: ${er.message}`);
          res.status(500).json({
            status: false,
            message: 'error creating new User',
            error: er,
          });
        }
        res.status(201).json({ status: true, new_user });
      });
    }
  });
};

module.exports.Login = (req, res) => {
  User.findOneUser(req.body[User.UNIQUE_FIELD], (err, data) => {
    if (err) {
      logger.error(`DB Error: ${err.message}`);
      res.status(500).json({
        status: false,
        message: 'some error occured',
        error: err,
      });
    }
    if (data) {
      const match = bcrypt.compareSync(req.body.password, data.password);

      if (match) {
        const expiry = '15m';
        const token = JWT.sign({ data: data.id }, process.env.JWT_SECRET, {
          expiresIn: expiry,
        });
        res.status(200).json({
          status: true,
          message: 'User successfully logged in',
          access_token: token,
          expiresIn: expiry,
        });
      } else {
        res.status(401).json({
          status: false,
          message: 'Wrong password',
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
  });
};
