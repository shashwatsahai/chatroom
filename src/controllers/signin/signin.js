var express = require("express");
const redisClient = require("../../core/redis/redisClient")
const { user: mongoUser } = require("../../core/mongo/controller")
const { BadRequest, GeneralError } = require('../error/error');


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
                userDetails = await mongoUser.getUser(user.email, user.password).catch(e => e);
                
                if(!userDetails || userDetails === 'User Not Found'){
                    throw new BadRequest('User Not Found');
                }
            }
            req.session.user = userDetails;
            return res.render("room", userDetails);
       
    } catch (e) {
        console.log(e);
        return next(new GeneralError(e));
    }

}
module.exports = signin
