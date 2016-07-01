var net = require('net');

var CONFIG = require('./config');

var input = process.stdin;
input.setEncoding('utf8');

var sockets = [];
var namesArr = [];

var server = net.createServer(function (socket) {
  sockets.push(socket);
  var socketID = socket.remoteAddress + ':' + socket.remotePort;
  var username;
  console.log('CONNECTED: ' + socketID);
  socket.setEncoding('utf8');

  for (var i = 0; i < sockets.length; i++) {
    if (sockets[i] === socket) {
      socket.write('Enter a username: ');
    }
  }

  socket.on('data', function (data) {
    if (username === undefined) {
      if (namesArr.indexOf(data) >= 0) {
        socket.write('Username exists.');
      } else if (data.toString().toLowerCase().includes('admin')) {
        socket.write('You\'re a Cylon! TO THE BRIG!');
        socket.destroy();
      } else {
        username = data;
        namesArr.push(username);
        socket.write('Hello ' + username);
        console.log(namesArr.length);
      }
      for (var j = 0; j < sockets.length; j++) {
        if (sockets[j] === socket) {
          continue;
        } else if (namesArr.indexOf(username) >= 0) {
          sockets[j].write(username.toString().trim() + ' has connected.');
        }
      }
    } else {
      for (var i = 0; i < sockets.length; i++) {
        sockets[i].write(socketID.toString().trim() + ': "' + data.toString().trim() + '"');
      }
    }
  });

  socket.on('close', function() {
    console.log('Leaver detected.');
    var leaver = sockets.indexOf(socket);
    var leaverID = namesArr.indexOf(username);
    sockets.splice(leaver, 1);
    namesArr.splice(leaverID, 1);
    console.log(namesArr.length);

    for (var i = 0; i < namesArr.length; i++) {
      sockets[i].write(username.toString().trim() + ' is a dirty leaver.');
    }

  });
});

server.listen(CONFIG.PORT, CONFIG.HOST, function () {
  var port = server.address().port;
  var address = server.address().address;
  console.log('Server listening on ' + address + ':' + port);
});

server.on('error', function (err) {
  console.error(err);
});

input.on('data', function (data) {
  for (var i = 0; i < namesArr.length; i++) {
    if (data.toString().trim() === ('\\kick ' + namesArr[i].toString().trim())) {
      sockets[i].destroy();
    } else {
      sockets[i].write('[ADMIN]: ' + data);
    }
  }
});