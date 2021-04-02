//backend code - server code, node code

console.log("server is running");

var express = require('express');

//app = application
// using constructor to create an express app
var app = express();

//create our server
//port 3000; wont close server bc server port is listening
//localhost:3000 - im only one tht can see this
var server = app.listen(3000);

//app uses files in public folder
app.use(express.static('public'));

var socket = require('socket.io');

//variable to keep track of inputs and outputs
var io = socket(server);

//set up a connection event - new input/output
//callback
io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("new connection! " + socket.id);

    socket.on('circle', circleMsg);
    socket.on('emoji', emojiMsg);

    function circleMsg(data) {
        socket.broadcast.emit('circle', data); //sends info of all servers to each other
    }

    function emojiMsg(data) {
        socket.broadcast.emit('emoji', data);
    }
}
