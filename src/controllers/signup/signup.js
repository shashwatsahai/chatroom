var express = require("express");
var router = express.Router();
const path = require("path");
const { check, validationResult } = require('express-validator');
const { user: mongoUser } = require("../../core/mongo/controller")
const redisClient = require("../../core/redis/redisClient")

const signup = {};

signup.addUser = async (req, res, next) => {
    try {
        const user = req.body;
        const result = await mongoUser.addUser(user);
        if (result && result.err) {
            req.session.error = "Error"

            if (result.err.code == 11000) {
                req.session.error = "User Already Exists"
            }

            return res.redirect("/")
        }
        req.session.user = {
            name: user.name,
            email: user.email,
            role: user.role
        };
        await redisClient.set(user.email, JSON.stringify(user));
        return res.render("room", user)
    } catch (e) {
        console.log(e);
    }

}


module.exports = signup;