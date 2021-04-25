var express = require("express");
const redisClient = require("../../core/redis/redisClient")
const { user: mongoUser } = require("../../core/mongo/controller")


const signin = {};

signin.auth = async (req, res, next) => {
    try {
        const user = req.body;
        if (!user || !user.email || !user.password) {
            req.app.set("error", "Incorrect Email or Password")
            return res.redirect("/");
        }
        let userDetails = req.session && req.session.user;
        if (!userDetails) {
            userDetails = await mongoUser.getUser(user.email, user.password);
            console.log("userDetails", userDetails);
            req.session.user = userDetails;
            //   await redisClient.set(user.email, JSON.stringify(userDetails));
        }
        return res.render("room", userDetails);
    } catch (e) {
        console.log(e);
    }

}
module.exports = signin
