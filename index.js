var socketio = require('socket.io'),
    express = require('express'),
    http = require('http'),
    monitor = require('./monitor');

var srv = http.createServer();
var io = socketio(srv, {
  pingInterval : 10000
});

srv.listen(5000, function(){
  console.log('Socket.io server listening on port 5000');
});

io.use(monitor);

io.on('connect', function(socket){
  console.log('Socket connected');

  socket.on('disconnect', function(socket){
    console.log('Socket disconnected');
  });

  socket.on('pizza_channel', function(data){
    io.emit('pizza_channel', data);
  });

  socket.on('taco_channel', function(data){
    io.emit('taco_channel', data);
  });

});

