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
        let userDetails;
        if (!userDetails) {
            userDetails = await mongoUser.getUser(user.email, user.password);
        }
        req.session.user = userDetails;
        console.log("userDetailsHERE", userDetails);
        return res.render("room", userDetails);
    } catch (e) {
        console.log(e);
    }

}
module.exports = signin
