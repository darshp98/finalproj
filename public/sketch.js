//to do:
//fix clearing issue - redraws white background over and over for some rsn
//maybe include player num of each client
//include end screen and play again

//drawing
var buttonRed, buttonBlue, buttonGreen, buttonOrange, buttonYellow, buttonViolet, buttonWhite, buttonBlack, buttonClear;
var redVal = 255, greenVal = 0, blueVal = 0;
var strokeSlider;
//
var socket;
var captionInput, userGuess, submitButton, nextButton, startButton;
var firstinstruction, firstphrase;
var timer = 30;
var startTimer = false;
var phrases = ['dog', 'cat', 'mouse', 'santa', 'snowman', 'elf', 'alien', 'spaceship', 'rocket'];
var index = 0;
var roundinfo = {
  newIndex: index,
  newPhrase: phrases[index],
  numofplayers: 2
} //sends the player index and player phrase
var drawingstart = false;

function setup() {
  createCanvas(500, 500);

  socket = io.connect('http://localhost:3000');
  socket.emit('turn', roundinfo);
  socket.on('turn', firstRound);
  socket.on('update', updated);
  socket.on('drawing', showDrawing);
  socket.on('clear', function () {
    background('white');
  });
  socket.on('timerstart', function (alltimerstart) {
    startTimer = alltimerstart;
  })

  socket.on('disconnect', function () {
    socket.disconnect();
  });

  nextButton = select('#Next');
  nextButton.mousePressed(nextRound);
  nextButton.position(1010, 600);
  nextButton.hide();

  submitButton = select('#Submit');
  submitButton.mousePressed(enteredGuess);
  submitButton.position(1080, 540);

  startButton = select('#Start');
  startButton.mousePressed(starting);
  startButton.position(980, 600);
  startButton.hide();

  captionInput = createInput('Enter your guess');
  captionInput.position(930, 540);

  //drawing stuff
  buttonRed = select('#Red');
  buttonOrange = select('#Orange');
  buttonYellow = select('#Yellow');
  buttonGreen = select('#Green');
  buttonBlue = select('#Blue');
  buttonViolet = select('#Violet');
  buttonWhite = select('#White');
  buttonBlack = select('#Black');
  buttonClear = select('#Clear');

  buttonRed.position(400, 600);
  buttonOrange.position(455, 600);
  buttonYellow.position(510, 600);
  buttonGreen.position(565, 600);
  buttonBlue.position(620, 600);
  buttonViolet.position(675, 600);
  buttonWhite.position(730, 600);
  buttonBlack.position(785, 600);
  buttonClear.position(840, 600);

  buttonRed.mousePressed(makeRed);
  buttonOrange.mousePressed(makeOrange);
  buttonYellow.mousePressed(makeYellow);
  buttonBlue.mousePressed(makeBlue);
  buttonGreen.mousePressed(makeGreen);
  buttonViolet.mousePressed(makeViolet);
  buttonWhite.mousePressed(makeWhite);
  buttonBlack.mousePressed(makeBlack);
  buttonClear.mousePressed(makeClear);

  strokeSlider = createSlider();
  strokeSlider.position(400, 650)
}

function starting() { //once clicked start button
  drawingstart = true; //drawing only for curr
  startTimer = true; //time needs to happen for everyone
  startButton.hide();
  socket.emit('timerstart', startTimer);
  //need to broadcast round has started to everyone
}

function firstRound(newplayerinfo) {
  startButton.show();
  firstinstruction = createP("Draw this: " + newplayerinfo.newPhrase);
  firstinstruction.position(600, 10)
}

function updated(broadcasted) { //recieves increased index values from  prev player and sent to everyone
  roundinfo.newIndex = broadcasted.newIndex; //second player info = first player updated info
  roundinfo.newPhrase = broadcasted.newPhrase;//puts new values into array 
  roundinfo.numofplayers = broadcasted.numofplayers;
  console.log(roundinfo)
}

function nextRound() { //once clicked next button
  roundinfo.newIndex += 1; //increases index
  roundinfo.newPhrase = phrases[roundinfo.newIndex] //increases phrase index
  firstinstruction.hide();
  nextButton.hide();
  background('white');
  socket.emit('clear');
  socket.emit('turn', roundinfo); //sends to server
  socket.emit('update', roundinfo); //sends to server
}

let Py = 100;
function enteredGuess() {
  userGuess = str(captionInput.value());
  let Px = 950;
  var guessP = createP(userGuess);
  guessP.position(Px, Py);

  if (userGuess == roundinfo.newPhrase) {
    let correct = createP("CORRECT");
    correct.position(1050, Py)
  } else if (userGuess != roundinfo.newPhrase) {
    let incorrect = createP("INCORRECT");
    incorrect.position(1050, Py)
  }
  Py += 20;
}

function draw() {
  textAlign(LEFT);
  clock = select('#circle');
  clock.position(400, 5);
  document.getElementById("countdown").innerHTML = timer

  if (startTimer) {
    if (frameCount % 60 == 0 && timer > 0) {
      timer--;
    }
  }
  if (timer == 0) {
    if (roundinfo.newIndex < roundinfo.numofplayers - 1) {
      if (drawingstart) {  //if ur the currdrawer
        nextButton.show();
      }
      fill(0)
      text("Times Up! The word was: " + roundinfo.newPhrase, 150, 250)
      timer = 30;
      startTimer = false;
      drawingstart = false;
    } else if (roundinfo.newIndex == roundinfo.numofplayers - 1) {
      fill(0)
      text("Times Up! The word was: " + roundinfo.newPhrase, 150, 250)
      text("GAME OVER", 200, 300)
      drawingstart = false;
    }
  }

}

function showDrawing(points) {
  stroke(points.r, points.g, points.b);
  strokeWeight(points.size);
  line(points.x, points.y, points.x + 1, points.y + 1)
}

//canvas drawing functions
function makeRed() {
  redVal = 255;
  greenVal = 0;
  blueVal = 0;
}

function makeOrange() {
  redVal = 252;
  greenVal = 134;
  blueVal = 0;
}

function makeYellow() {
  redVal = 255;
  greenVal = 238;
  blueVal = 0;
}

function makeBlue() {
  redVal = 0;
  greenVal = 0;
  blueVal = 255;
}

function makeGreen() {
  redVal = 0;
  greenVal = 255;
  blueVal = 0;
}

function makeViolet() {
  redVal = 204;
  greenVal = 0;
  blueVal = 255;
}

function makeWhite() {
  redVal = 255;
  greenVal = 255;
  blueVal = 255;
}

function makeBlack() {
  redVal = 0;
  greenVal = 0;
  blueVal = 0;
}

function makeClear() {
  background('white');
  socket.emit('clear');
}

function mouseDragged() {

  if (drawingstart) {
    stroke(redVal, greenVal, blueVal);
    strokeWeight(strokeSlider.value());
    line(mouseX, mouseY, (mouseX + 1), (mouseY + 1));

    var points = {
      x: mouseX,
      y: mouseY,
      r: redVal,
      g: greenVal,
      b: blueVal,
      size: strokeSlider.value()
    }

    socket.emit('drawing', points);
  }
}