var express = require("express");
var app = express.Router();
const path = require("path");

app.all("*", (err, req, res) => {
    console.log("ERROR", err);
    res.status(500).send(err);
})

module.exports = app;
