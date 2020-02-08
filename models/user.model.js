const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    "username": String,
    "email": { type: String, required: true },
    "first_name": String,
    "last_name": String,
    "password": { type: String, required: true }
}, { timestamps: true });


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

const User = new mongoose.model('User', userSchema);
module.exports = User;

