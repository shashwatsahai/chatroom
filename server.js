require("dotenv").config();

process.on('uncaughtException', (e) => {
    console.error("Uncaught Exception", e);
})

const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const errorHandler = require('./src/routes/errorhandler')
var expressSession = require('express-session');
const initMongo = require("./src/core/mongo/index")
const PORT = process.env.PORT || 3000;


const server = http.createServer(app);
const socket = require("socket.io");
const io = socket.listen(server);

const socketConnection = require("./src/core/socket/socketConnection");
const apiRoutes = require("./src/routes/index");

//Set Static folders
app.set("view engine", "pug");
app.use(express.static("public"));

socketConnection(io);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: process.env.SECRET, saveUninitialized: false, resave: false, cookie: {
        maxAge: 60000
    }
}));


app.get("/", (req, res) => {
    const error = (req.session.error || "none")
    res.render("index", { error })
})

// routes
app.use("/api", apiRoutes);

initMongo().then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, (err) => console.log("listening on", PORT));
}).catch((e) => {
    console.log("HERE", e);
})

app.use(errorHandler);

