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


const typeHandler = function (e) {
  const searchedText = e.target.value;

  socket.emit("search", {
    name: username,
    text: searchedText,
    room: room
  })
}


const searchBar = document.querySelector('#searchbar');
const resultBar = document.querySelector('#results');
searchBar.addEventListener('input', typeHandler) // register for oninput

socket.on('searchResult', (results) => {
  try {
    $("#results").empty();
    var html = ""
    if (results.messages && results.messages.length) {
      results.messages.forEach((msg) => {
        html += '<li>' + msg.text + '</li>'
      })
      $("#results").append(html)
      console.log(results);
    }
  } catch (e) {
    console.log(e);
  }
})

socket.on('roomUsers', function ({ room, users }) {
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

function outputUsers(users) {
  var ul = document.getElementById('users');
  ul.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

function outputRoom(room) {
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
