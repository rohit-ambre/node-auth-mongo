const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const logger = require('../../winston-config');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    first_name: {
      type: String,
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * unique field used for authentication
 */
userSchema.statics.UNIQUE_FIELD = 'email';

/**
 * encrypt password before save
 */
userSchema.pre('save', function (next) {
  const user = this;
  // don't rehash if it's an old user
  if (!user.isModified || !user.isNew) {
    next();
  } else {
    bcrypt.hash(
      user.password,
      parseInt(process.env.SALT, 10),
      (err, hashed) => {
        if (err) {
          next(err);
        }
        user.password = hashed;
        next();
      }
    );
  }
});

/**
 * Checks whether user with same unique fiels already exist or not
 * @returns User object on success and null if not found
 */
userSchema.statics.findOneUser = function (field, cb) {
  this.findOne({ [this.UNIQUE_FIELD]: field }, function (err, foundUser) {
    if (err) {
      logger.error(`DB Error: ${err.message}`);
      return cb(err);
    }
    if (!foundUser) {
      return cb(null, null);
    }

    return cb(null, foundUser);
  });
};

module.exports = new mongoose.model('User', userSchema);
