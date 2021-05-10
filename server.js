console.log("server is running");

var express = require('express');
var app = express();
app.use(express.static('public'));

var server = app.listen(3000);
//heroku
// var port = process.env.PORT || 3000;
// var server = app.listen(port);

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

var players = []; //all socket ids

function newConnection(socket) {
    //  console.log("new connection! " + socket.id);

    players.push(socket.id);
    console.log(players)

    socket.on('turn', function (roundinfo) {
        currPlayer = players[roundinfo.newIndex];
        currPhrase = roundinfo.newPhrase;
        socket.to(currPlayer).emit('turn', currPhrase)
    })

    socket.on('drawing', drawingMsg);
    function drawingMsg(points) {
        socket.broadcast.emit('drawing', points);
    }

    socket.on('disconnect', function () {
        let index = players.indexOf(socket.id);
        players.splice(index, 1);
    });
}