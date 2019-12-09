var fs = require('fs');
var http = require('http');
var server = http.createServer();

server.on('request', function(req, res) {
    res.end();
});
var io = require('socket.io').listen(server);
server.listen(8080);

io.sockets.on('connection', function(socket) {
    socket.emit('connect', {message: 'connect success.'}, function (data) {
        console.log('data: ' + data);
    });
});
