const socket = io();

// Load previous messages when the user enters the web page
window.onload = function() {
  socket.emit('load messages');
};

socket.on('previous messages', (messages) => {
  const messagesContainer = document.getElementById('messages');
  messages.forEach((message) => {
    const item = document.createElement('li');
    item.textContent = message.text;
    item.classList.add('message');

    // Check if the message is sent by the current user
    if (message.self) {
      item.classList.add('self-message');
    } else {
      item.classList.add('other-message');
    }

    messagesContainer.appendChild(item);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto scroll to bottom
});

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('input');
  const message = input.value.trim();
  
  if (message) {
    if (message === '/clear') {
      socket.emit('clear messages');
    } else {
      socket.emit('chat message', message);
    }
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = msg.text;
  item.classList.add('message');

  // Check if the message is sent by the current user
  if (msg.self) {
    item.classList.add('self-message');
  } else {
    item.classList.add('other-message');
  }

  document.getElementById('messages').appendChild(item);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight; // Auto scroll to bottom
});

socket.on('clear messages', function() {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = ''; // Clear all messages
});
