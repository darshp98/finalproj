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

function newConnection(socket) {
    //  console.log("new connection! " + socket.id);

    players.push(socket.id);
    console.log(players)

    socket.on('firstplayer', firstMsg);
    function firstMsg(i) {
        firstP = players[i];
        firstPh = phrases[i];
        socket.to(firstP).emit('firstplayer', firstPh);
    }

    socket.on('nextround', nextMsg)

    function nextMsg(i) { //display phrase to curr player in array, once round is over, i increases and sends display to next player
        currPlayer = players[i];
        phrase = phrases[i];
        socket.to(currPlayer).emit('nextround', phrase);   

        socket.on('broadcast', function () {
            socket.broadcast.emit('broadcast', i); 
        })   
    }

    socket.on('drawing', drawingMsg);
    function drawingMsg(points) {
        socket.broadcast.emit('drawing', points);
    }

    socket.on('disconnect', function () {
        let index = players.indexOf(socket.id);
        players.splice(index, 1);
    });
}