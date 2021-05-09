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

var phrases = ['dog', 'cat', 'mouse', 'santa', 'snowman', 'elf', 'alien', 'spaceship', 'rocket']; //all given phrases
var players = []; //all socket ids
var display = false;

function newConnection(socket) {
    console.log("new connection! " + socket.id);
    players.push(socket.id);

    socket.on('roundstart', startMsg)
    function startMsg(i) { //display phrase to curr player in array, once round is over, i increases and sends display to next player
        currPlayer = players[i];
        phrase = phrases[i];
        socket.to(currPlayer).emit('options', phrase);
    }

    socket.on('userguesses', guessMsg);
    function guessMsg(userGuess) {
        socket.broadcast.emit('userguesses', userGuess);
        console.log('server:' + userGuess)
    }

    socket.on('drawing', drawingMsg);
    function drawingMsg(points) {
        socket.broadcast.emit('drawing', points);
    }
}