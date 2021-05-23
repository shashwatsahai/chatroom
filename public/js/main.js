const socket = io();
const chatMessages = document.querySelector('.chat-messages');
let {
  username,
  room
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

username = document.getElementById("username").innerHTML;
room = document.getElementById("roomname").innerHTML;
//Join chatroom
socket.emit('joinRoom', {
  username,
  room
});

//Message from server
socket.on('message', function (message) {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight
  //scroll down
});

socket.on('roomUsers', function ({room, users}) {
  outputRoom(room);
  outputUsers(users);
})

const chatForm = document.getElementById('chat-form');

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  var msg = event.target.elements.msg.value;

  //emit message to the chat server
  socket.emit('chatMessage', {
    username,
    msg
  });

  //set msg to null
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
})

function outputUsers(users){
  var ul = document.getElementById('users');
  ul.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
  // for(var user in users){
  //   var li = document.createElement('li');
  //   li.appendChild(document.createTextNode(users[user].username));
  //   ul.appendChild(li);
  // }
}

function outputRoom(room){
  document.getElementById('roomname').innerHTML = room;
}

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
						<p class="text">
						${message.text}
            </p>`;
  chatMessages.appendChild(div);
}
