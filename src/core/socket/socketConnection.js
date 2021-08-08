const roomHandler = require("./roomHandler");
const chatHandler = require("./chatHandler")

module.exports = (io) => {
    io.on("connection", function (socket) {
        console.log("New connection");
        roomHandler(io, socket)
        chatHandler(io, socket)
    });
};
