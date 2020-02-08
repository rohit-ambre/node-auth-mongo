const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

module.exports.SignUp = (req, res) => {

    this.findOne(req.body.email, (err, data) => {
        if (err) {
            res.status(500).json({ status: false, message: 'some error occured', error: err });
        }
        if (data) {
            res.status(200).json({ status: false, message: 'User already exist' });
        } else {
            const user = new User(req.body);

            user.save((err, data) => {
                if (err) {
                    return res.status(500).json({ status: false, message: "error creating new User", error: err });
                }
                res.status(201).json({ status: true, data: data })
            })
        }
    })
}


module.exports.Login = (req, res) => {

    this.findOne(req.body.email, (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json({ status: false, message: "some error occured", error: err });
        }
        if (data) {
            const match = bcrypt.compareSync(req.body.password, data.password);

            if (match) {
                const expiry = 60 * 60;
                const token = JWT.sign(
                    { data: data.id },
                    process.env.JWT_SECRET,
                    { expiresIn: expiry }
                )
                res.status(200).json({ status: true, access_token: token, expiresIn: expiry })
            } else {
                res.status(401).json({ status: false, message: "Wrong password" });
            }
        }
    });
}

module.exports.getAllUsers = (req, res) => {

    User.find({}, '_id username email first_name last_name createdAt updatedAt', (err, users) => {
        if (err) {
            res.status(500).json({ status: false, message: "some error occured", error: err });
        }
        if (users) {
            res.status(200).json({ status: true, data: users })
        }
    });
}

module.exports.findOne = async (email, cb) => {

    try {
        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
            return cb(null, null);
        }
        return cb(null, foundUser)
    } catch (error) {
        if (error) return cb(error)
    }
}