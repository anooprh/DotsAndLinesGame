var shortid = require('shortid');
var express = require('express');
var _ = require('underscore');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/'));
console.log('Express server started on port 3000');

var clients = {};
var gamers = {};

io.sockets.on('connection', function (socket) {
    socket.id = shortid.generate();
    clients[socket.id] = socket;
    if (_.size(clients) === 2) {

        var gamer1 = clients[_.keys(clients)[0]];
        var gamer2 = clients[_.keys(clients)[1]];
        delete clients[_.keys(clients)[0]];
        delete clients[_.keys(clients)[1]];

        gamer1['opponent'] = gamer2;
        gamer2['opponent'] = gamer1;

        gamer1.emit('matchFound', gamer1['opponent'].id);
        gamer2.emit('matchFound', gamer2['opponent'].id);

        gamers[gamer1.id] = gamer1;
        gamers[gamer2.id] = gamer2;
    }

    socket.emit('setId', socket.id);

    socket.on('userClick', function (data) {
//        console.log(data);
        var userId = data.socketId;
        gamers[userId].emit('updateBlock', data);
        gamers[userId]['opponent'].emit('updateBlock', data);
    });
});