const User = require('../models/user.model');

module.exports.SignUp = (req, res, next) => {

    this.findOne(req.body.email, (err, data) => {
        if (err) {
            res.json({ status: false, message: 'some error occured', error: err });
        }
        if (data) {
            res.json({ status: false, message: 'User already exist' });
        } else {
            const user = new User(req.body);

            user.save((err, data) => {
                if (err) {
                    return res.json({ status: false, message: "error creating new User", error: err });
                }
                res.json({ status: true, data: data })
            })
        }
    })
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