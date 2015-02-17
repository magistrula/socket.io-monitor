var parser = require('socket.io-parser');
var inbound = 0;
var outbound = 0;

var messageCounts = {
  inbound : {},
  outbound : {}
}

setInterval(function(){
  console.log(messageCounts);
}, 1000);

function incrementCounter(direction, type, data){
  if (typeof messageCounts[direction] === 'undefined'){
    messageCounts[direction] = {}
  }
  if (typeof messageCounts[direction][type] === 'undefined'){
    messageCounts[direction][type] = 0;
  }
  messageCounts[direction][type] += 1;
}

module.exports = function(socket, next){
  socket.conn.on('packetCreate', function(packet){
    var decoder = new parser.Decoder();
    decoder.on('decoded', function(decodedPacket){
      incrementCounter('outbound', packet.type, decodedPacket.data);
    });
    decoder.add(packet.data || '');
    decoder.destroy();
  });

  socket.conn.on('packet', function(packet){
    var decoder = new parser.Decoder();
    decoder.on('decoded', function(decodedPacket){
      incrementCounter('inbound', packet.type, decodedPacket.data);
    });
    decoder.add(packet.data || '');
    decoder.destroy();
  });

  next();
};

