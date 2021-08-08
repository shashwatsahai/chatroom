const { user: User } = require("../models")
const mongoose = require("mongoose");

const userController = {}
userController.addUser = (userDetails) => {
    return new Promise((resolve, reject) => {
        const user = new User(userDetails);
        user.save((err, user) => {
            if (err) {
                if (err.code === 11000) {
                    resolve({ err });
                }
            }
            resolve(user)
        });
    })
}

userController.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        console.log("EMAIL",email)
        User.findOne({ email: email }, (err, user) => {
            console.log("HERE",user)
            if (err || !user) {
                return reject("User Not Found");
            }


            if (!user.authenticate(password)) {
                return reject("Invalid Password");
            }

            // const token = jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY);
            // res.cookie("token", token, { expire: new Date() + 99999 });
            // const { _id, name, email, role } = user;
            // return res.json({ token, user: { _id, name, email, role } });
            delete user.encry_password;
            delete user.salt;
            return resolve(user);
        })
    })
}


module.exports = userController;