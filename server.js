console.log("server is running");

var express = require('express');

//app = application
// using constructor to create an express app
var app = express();

//create our server
var server = app.listen(3000);
//heroku
// var port = process.env.PORT || 3000;
// var server = app.listen(port);

//app uses files in public folder
app.use(express.static('public'));

//creates socket
var socket = require('socket.io');
var io = socket(server);

//set up a connection event
io.sockets.on('connection', newConnection);
var phrasesOfSockets = {};
var orderCount = 0;

function newConnection(socket) {
    console.log("new connection! " + socket.id);
    socketName = socket.id;
    orderCount += 1;

    phrasesOfSockets[socketName] = {
        'order': orderCount, 'phrase': ''
    };

    socket.on('firstPhrases', phraseMsg);
    function phraseMsg(data) {

        phrasesOfSockets[socketName]['phrase'] = data; //replaces 'phrase' w user's phrase
        console.log(phrasesOfSockets);

        currPlayer = phrasesOfSockets[socketName]['order'];

        for (var [key, value] of Object.entries(phrasesOfSockets)) {

            if (value['order'] == currPlayer + 1) { //this is not happening bc not true ever

                io.to(key).emit('firstPhrases', data); //emits phrase of first player to second player key, and so forth

                console.log(value['order']);
                console.log(currPlayer);
            }
        }
    }
}