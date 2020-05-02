const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    "username": { type: String, unique: true, trim: true },
    "email": { type: String, required: true, unique: true, trim: true },
    "first_name": { type: String, trim: true },
    "last_name": { type: String, trim: true },
    "password": { type: String, required: true }
}, { timestamps: true });

// unique field used for authentication
userSchema.statics.UNIQUE_FIELD = 'email';

// encrypt password before save
userSchema.pre('save', function (next) {

    const user = this;
    if (!user.isModified || !user.isNew) { // don't rehash if it's an old user
        next();
    } else {
        bcrypt.hash(user.password, parseInt(process.env.SALT), (err, hashed) => {
            if (err) {
                console.log(err)
                next(err)
            }
            user.password = hashed;
            next();
        });
    }
})


userSchema.statics.findOneUser = async (field, cb) => {

    try {      
        const foundUser = await User.findOne({ [User.UNIQUE_FIELD]: field });
        if (!foundUser) {
            return cb(null, null);
        }
        return cb(null, foundUser)
    } catch (error) {
        if (error) return cb(error)
    }
}

const User = new mongoose.model('User', userSchema);
module.exports = User;

