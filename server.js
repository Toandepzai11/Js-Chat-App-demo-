const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let messages = []; // Store messages

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Send previous messages when a user connects
  socket.emit('previous messages', messages.map(msg => ({ text: msg.text, self: msg.userId === socket.id })));

  socket.on('chat message', (msg) => {
    const message = { text: msg, userId: socket.id };
    messages.push(message);
    io.emit('chat message', { text: message.text, self: message.userId === socket.id });
  });

  socket.on('clear messages', () => {
    messages = []; // Clear the messages array
    io.emit('clear messages'); // Broadcast clear command to all clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});