var express = require("express");
var app = express.Router();
const path = require("path");
const { check, validationResult } = require('express-validator');
const { signup, signin } = require("../controllers")
const errorHandler = require("./errorhandler")

app.post("/signin",
    signin.auth,
    errorHandler
);

app.post("/signup",
    signup.addUser,
    errorHandler
);

app.get("/chatroom", (req, res) => {
    res.render("room");
},
    errorHandler);

app.get("/chat", (req, res) => {
    try {
        console.log("req,query", req.query)
        res.render("chat");
    } catch (e) {
        console.log("ERROR IN CHAT ROUTE", e);
    }

},
    errorHandler);

module.exports = app;
