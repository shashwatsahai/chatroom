require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
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



// app.use((req, res, next) => {
//     try{
//         res.locals.cspNonce = 'e33ccde670f149c1789b1e1e113b0916';
//         if (req.session && req.session.user) {
//             let username = req.body.username || req.session.username;
//             let room = req.body.room || req.session.room;
//             if(!req.session || !req.session.user || !req.session.user.username ){
//                 req.session.user = {};
//                 req.session.user.username = username;
//                 req.session.user.room = room;
//             }
//             req.session.user.username = username;
//             req.session.user.room = room;
//             console.log("USERNAME",username, "ROOM",room,"FROM USER");
//             return res.render("chat", {username, room});
//         }
//         next && next();
//     }
//     catch(e){
//         console.log("appuse",e);
//     }
// })
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

