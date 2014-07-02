var shortid = require('shortid');
var express = require('express');
var _ = require('underscore');

var app = express();
var port = Number(process.env.PORT || 3000);
var server = app.listen(port);
var io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));
console.log('Express server started on port ' + port);

var clients = [];
var gamers = {};

io.sockets.on('connection', function (socket) {
    socket.id = shortid.generate();
    clients.push(socket);
    if (_.size(clients) > 1) {
        gamer1 = clients.shift();
        gamer2 = clients.shift();
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

    socket.on('finishedGame', function (socketid) {
        delete gamers[socketid];
    });

    socket.on('timedOut', function (socketId) {
        try {
            var opponentId = gamers[socketId]['opponent'].id;
            gamers[socketId].emit('result', 'lose');
            gamers[socketId]['opponent'].emit('result', 'win');

            delete gamers[socketid];
            delete gamers[opponentId];
        } catch (e) {
            console.log("I'm thrown!! Someone please catch me :D");
        }
    });

    socket.on('disconnect', function () {
        try {
            var socketId = socket.id;
            var opponentId = "";
            opponentId = gamers[socketId]['opponent'].id;
            gamers[opponentId].emit('result', 'win');
            delete gamers[socketId];
            delete gamers[opponentId];
            var index = clients.indexOf(socket);
            if (index > -1) {
                clients.splice(index, 1);
            }

        } catch (e) {
            console.log("I'm thrown!! Someone please catch me :D");
        }

    });
});