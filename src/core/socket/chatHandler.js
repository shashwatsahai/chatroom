const {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave,
    getUserRoom
} = require("../../utils/users");
const formatMessage = require("../../utils/messages");
const ESChat = require("../elasticsearch/indexes/chat")

module.exports = (io, socket) => {
    //Receive a message
    const chatMessage = (message, callback) => {
        var user = getCurrentUser(socket.id);
        io.to(user.room).emit(
            "message",
            formatMessage(message.username, message.msg)
        );
    }

    socket.on("chatMessage", chatMessage)
    socket.on("chatMessage", (data) => {
        data.room = getUserRoom(socket.id);
        ESChat.indexDoc(data, (err, response)=>{
            if(err){
                console.log(err);
            }
            console.log(response)
        })
    })

    socket.on("search", (data) => {
        ESChat.search(data, (err, results) =>{
            if(err){
                console.log(err);
                return;
            }
            console.log("RESILTS",results)
            socket.emit("searchResult", results)
        })
    })
}