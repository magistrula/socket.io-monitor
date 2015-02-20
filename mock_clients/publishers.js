var http = require('http');
var express = require('express');
var ioc = require('socket.io-client');

var client1 = ioc('http://localhost:5000', {forceNew: true}),
    client2 = ioc('http://localhost:5000', {forceNew: true});

setInterval(function(){
  console.log('Emitting to pizza channel');
  client1.emit('pizza_channel','pizza_data');
  console.log('Emitting to taco channel');
  client2.emit('taco_channel','taco_data');
}, 1000);
