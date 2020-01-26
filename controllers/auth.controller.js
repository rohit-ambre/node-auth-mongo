const User = require('../models/user.model');

module.exports.SignUp = (req, res, next) => {

    this.findOne(req.body.email, (err, data) => {
        if (err) {
            res.json({ response: false, message: 'some error occured' });
        }
        if (data) {
            res.json({ response: false, message: 'User already exist' });
        } else {
            const user = new User(req.body);

            user.save((err, data) => {
                if (err) {
                    return res.json({ response: false, message: "error creating new User" });
                }
                res.json({ response: true, data: data })
            })
        }
    })
    // res.send(req.body)
}

module.exports.findOne = (email, cb) => {

    User.findOne({ email: email }, (err, data) => {
        if (err) return cb(err)
        if (!data) {
            return cb(null, null);
        }
        else {
            return cb(null, data)
        }
    })
}