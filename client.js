var net = require('net');

var CONFIG = require('./config');

var socket = new net.Socket();

socket.setEncoding('utf8');

socket.connect({ port: CONFIG.PORT }, function () {
  console.log('CONNECTED TO: ' + socket.remoteAddress + '.' + socket.remotePort);
});

var input = process.stdin;
var output = process.stdout;

input.setEncoding('utf8');

input.on('data', function (data) {
  socket.write(data);
});

socket.on('error', function (err) {
  console.log(err);
});

socket.on('close', function () {
  console.log('disconnected from server.');
});

socket.on('data', function (data) {
  console.log(data);
});