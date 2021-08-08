var express = require("express");
const path = require("path");

const { GeneralError } = require('../controllers/error/error');

const handleErrors = (err, req, res, next) => {
    console.log("ERROR", err);
    if (err instanceof GeneralError) {
        return res.status(err.getCode()).json({
            status: 'error',
            message: err.message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: err.message
    });
}

module.exports = handleErrors;
