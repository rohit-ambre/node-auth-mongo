const User = require('../models/user.model');
const logger = require('../../winston-config');

module.exports.getAllUsers = (req, res) => {
  User.find(
    {},
    '_id username email first_name last_name createdAt updatedAt',
    (err, users) => {
      if (err) {
        logger.error(`DB Error: ${err.message}`);
        res.status(500).json({
          status: false,
          message: 'some error occured',
          error: err,
        });
      }
      if (users) {
        res.status(200).json({ status: true, data: users });
      }
    }
  );
};
