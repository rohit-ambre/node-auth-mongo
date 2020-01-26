const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    "username": String,
    "email": { type: String, required: true },
    "first_name": String,
    "last_name": String,
    "password": { type: String, required: true }
}, { timestamps: true });

const User = new mongoose.model('User', userSchema);

module.exports = User;

