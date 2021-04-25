const {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave,
} = require("../../utils/users");

const formatMessage = require("../../utils/messages");
function initConnection(io) {
    const botName = "ChatCord Bot";
    io.on("connection", function (socket) {
        console.log("New connection");
        socket.on("joinRoom", function ({ username, room }) {
            //Welcome msg for the user

            const user = userJoin(socket.id, username, room);
            socket.join(user.room); //join a socket for emits
            socket.emit(
                "message",
                formatMessage(botName, "Welcome to Chat " + user.username)
            ); //to the client

            //BroadCast to everyone except user when user connects
            socket.broadcast
                .to(user.room)
                .emit(
                    "message",
                    formatMessage(
                        botName,
                        `${user.username} has joined the chat`
                    )
                ); //to everyone except the client

            //Send user and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        });

        //BroadCast to all
        socket.on("disconnect", function () {
            var user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit(
                    "message",
                    formatMessage(botName, `${user.username} has left the chat`)
                );

                io.to(user.room).emit("roomUsers", {
                    room: user.room,
                    users: getRoomUsers(user.room),
                });
            }
        });

        //Receive a message
        socket.on("chatMessage", function (chatMessage) {
            var user = getCurrentUser(socket.id);
            console.log(user);
            io.to(user.room).emit(
                "message",
                formatMessage(chatMessage.username, chatMessage.msg)
            );
        });
    });
}

module.exports = initConnection;
