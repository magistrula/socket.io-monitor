var parser = require('socket.io-parser');
var MessageCounter = require('./MessageCounter');
var http = require('http');
var express = require('express');

var app = express(http.createServer);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', function(req, res){
  res.json(messageCounter.data);
});

app.listen(5001, function(){
  console.log('monitor listening on 5001');
});

messageCounter = new MessageCounter();

setInterval(function(){
  // console.log(messageCounter.data);
}, 1000);

var decodePacketEvent = function(packet, callback){
  var decoder = new parser.Decoder();
  decoder.on('decoded', function(decodedPacket){
    var eventName = decodedPacket.data ? decodedPacket.data[0] : 'empty';
    callback(eventName);
  });
  decoder.add(packet.data || '');
  decoder.destroy();
}

module.exports = function(socket, next){
  debugger;

  socket.conn.on('packetCreate', function(packet){
    decodePacketEvent(packet, function(eventName){
      messageCounter.incrementOutbound(packet.type, eventName);
    });
  });

  socket.conn.on('packet', function(packet){
    decodePacketEvent(packet, function(eventName){
      messageCounter.incrementInbound(packet.type, eventName);
    });
  });

  next();
};

