console.log("server is running");

var express = require('express');
var app = express();
app.use(express.static('public'));

//var server = app.listen(3000);
//heroku
var port = process.env.PORT || 3000;
var server = app.listen(port);

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

var players = []; //all socket ids
var broadcasted = {};

function newConnection(socket) {

    players.push(socket.id);
 //   console.log(players)

    socket.on('turn', function (roundinfo) { //recieves increased index values from player that clicked next
        currPlayer = players[roundinfo.newIndex];
        socket.to(currPlayer).emit('turn', roundinfo); //sends those values to next player
        console.log(roundinfo);
    })

    socket.on('update', function (roundinfo) { //recieves increased index values from player that clicked next
        roundinfo.numofplayers= players.length;
        socket.broadcast.emit('update', roundinfo); //sends those values back to everyone
    })

    socket.on('clear', clearMsg);
    function clearMsg() {
        socket.broadcast.emit('clear');
    }

    socket.on('timerstart', function(startTimer) {
        socket.broadcast.emit('timerstart', startTimer)
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