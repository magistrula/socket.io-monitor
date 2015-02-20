var http = require('http');
var express = require('express');
var ioc = require('socket.io-client');

var clients = [];

var num = 0;
var id = setInterval(function(){
  if(num <= 100) {
    createClient(num);
    num++;
  } else {
    clearInterval(id);
    return;
  }
}, Math.random()*1000);

var createClient = function(i){
  var client = ioc('http://localhost:5000', {forceNew:true})

  client.on('connect', function(){
    console.log('client', i, 'connected as', this.id);
  });

  clients.push(client);
}