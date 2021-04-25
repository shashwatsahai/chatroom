const mongoose = require("mongoose");

function initMongo() {
    return mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
}

module.exports = initMongo;