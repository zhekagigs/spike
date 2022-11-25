const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

// Socket.IO is composed of two parts:
// A server that integrates with (or mounts on) the Node.JS HTTP Server socket.io
// A client library that loads on the browser side socket.io-client
// During development, socket.io serves the client automatically for us, as we’ll see, so for now we only have to install one module:

const homepage = __dirname + '/index.html'
var number_of_users = 0;

app.get('/', (req, res) => {
  res.sendFile(homepage);
});

io.on('connection', (socket) => {
    number_of_users++;
    console.log('a user connected, total is  ' + number_of_users);
    io.emit('chat message', "New user connected") ;
    
    socket.on('registration name', (msg) => {
        console.log('registered user: ' + msg )
        io.emit('chat message', "Please, welcome " + msg);
    })

    socket.on('disconnect', () => {
      io.emit('User '+ number_of_users + 'disconnected')
      number_of_users--;
      console.log('user disconnected, total is  ' + number_of_users);
    });
});


io.on('connection', function(socket){
  fs.readFile('image.jfif', function(err, buf){
    // it's possible to embed binary data
    // within arbitrarily-complex objects
    socket.emit('image', { image: true, buffer: buf });
  });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
});


// This will emit the event to all connected sockets
io.emit('connection', { someProperty: 'Hello User', otherProperty: 'other value' }); 

server.listen(3000, () => {
  console.log('listening on *:3000');
});