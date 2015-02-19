var socketio = require('socket.io'),
    parser = require('socket.io-parser'),
    http = require('http'),
    express = require('express');

var MessageCounter = require('./MessageCounter');

var app = express();
var srv = http.createServer(app);
var io = socketio(srv);

io.on('connect', function(socket){
  console.log('Socket connected to monitoring server');
  socket.join('messages');
});

app.use(express.static(__dirname + '/app'));

app.get('/messages', function(req, res){
  res.json(messageCounter.data);
});

srv.listen(5001, function(){
  console.log('monitor listening on 5001');
});

messageCounter = new MessageCounter();

setInterval(function(){
  // console.log(messageCounter.data);
}, 1000);

var broadcastSocketEvent = function(socketId, type) {
  io.to('messages').emit(type + '_received', {socketId: socketId, date: new Date()});
}

var decodePacketEvent = function(packet, callback){
  var decoder = new parser.Decoder();
  decoder.on('decoded', function(decodedPacket){
    var eventName = decodedPacket.data ? decodedPacket.data[0] : 'empty';
    callback(eventName);
  });
  decoder.add(packet.data || '');
  decoder.destroy();
}

var hostIo;

module.exports = function(socket, next){
  // if(!hostIo){
  //   hostIo = socket.nsp;
  //   hostIo.on('connect', function(){
  //     broadcastSocketEvent(socket.id, 'connected');
  //   });
  // }

  socket.on('disconnect', function(){
    broadcastSocketEvent(socket.id, 'disconnected');
  });

  socket.conn.on('packetCreate', function(packet){
    if (packet.type === 'pong'){
      broadcastSocketEvent(socket.id, packet.type);
    }
    decodePacketEvent(packet, function(eventName){
      messageCounter.incrementOutbound(packet.type, eventName);
    });
  });

  socket.conn.on('packet', function(packet){
    console.log('ping', socket.id);
    if (packet.type === 'ping'){
      broadcastSocketEvent(socket.id, packet.type);
    }
    decodePacketEvent(packet, function(eventName){
      messageCounter.incrementInbound(packet.type, eventName);
    });
  });

  next();
};

