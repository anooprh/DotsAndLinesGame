var shortid = require('shortid');
var express = require('express');
var _ = require('underscore');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));
console.log('Express server started on port 3000');

var clients = [];
var gamers = {};

io.sockets.on('connection', function (socket) {
    socket.id = shortid.generate();
    clients.push(socket);
    if (_.size(clients) % 2 === 0 && _.size(clients) > 0) {
        gamer1 = clients.pop();
        gamer2 = clients.pop();
        gamer1['opponent'] = gamer2;
        gamer2['opponent'] = gamer1;

        gamer1.emit('matchFound', gamer1['opponent'].id);
        gamer2.emit('matchFound', gamer2['opponent'].id);

        gamers[gamer1.id] = gamer1;
        gamers[gamer2.id] = gamer2;
    }
    socket.emit('setId', socket.id);
    socket.on('userClick', function (data) {
        var userId = data.socketId;
        gamers[userId].emit('updateBlock', data);
        gamers[userId]['opponent'].emit('updateBlock', data);
    });
});