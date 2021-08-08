const {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave,
} = require("../../utils/users");
const formatMessage = require("../../utils/messages");



module.exports = (io, socket) => {
    const botName = "ChatCord Bot";
    const chatRoomJoin = function ({ username, room }) {
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


    }

    const chatRoomLeave = function () {
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
    }
    socket.on("joinRoom", chatRoomJoin)
    socket.on("disconnect", chatRoomLeave)
}