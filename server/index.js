/// will have code for server
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());

const server = http.createServer(app);
// connecting socket.io server with the server above
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// we're listening for an event with that name/id "connection" or whatever we choose
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID ${socket.id} joined room ${data}`)
  })

  socket.on('disconnect', () => {
    console.log("User disconnected", socket.id);
  })

  socket.on('sendMessage', (data) => {
    socket.to(data.room).emit('receive_message', data)
  })
})

server.listen(3001, () => {
  console.log("Server running");
})