var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/'));
console.log('Express server started on port 3000');
io.sockets.on('connection', function (socket) {
    socket.on('userClick', function (data) {
        console.log(data);
    });
});