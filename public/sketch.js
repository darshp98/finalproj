var socket;
var captionInput, givenPhrases, userGuess, showUserGuess, submitButton, nextButton;
var timer = 60;
//drawing
var buttonRed, buttonBlue, buttonGreen;
var redVal = 255, greenVal = 0, blueVal = 0;
var strokeSlider;
var i=0;
var firstinstruction;

//next button to start the next round, shows pop up to next player in array their word, timer starts; simple enter into input, replies right or wrong

function setup() {
  createCanvas(500, 500);

  socket = io.connect('http://localhost:3000');

  socket.emit('firstplayer', i);
  socket.on('firstplayer', firstRound);
  socket.on('drawing', showDrawing);
  socket.on('nextround', roundStarted);

  socket.on('disconnect', function () {
    socket.disconnect();
  });

  nextButton = select('#Next');
  nextButton.mousePressed(nextPlayer);
  nextButton.position(1000, 600);

  submitButton = select('#Submit');
  submitButton.mousePressed(enteredGuess);
  submitButton.position(1100, 550);

  captionInput = createInput('Enter your guess');
  captionInput.position(950, 550);

  //drawing stuff
  buttonRed = select('#Red');
  buttonBlue = select('#Blue');
  buttonGreen = select('#Green');

  buttonRed.position(400, 600);
  buttonBlue.position(500, 600);
  buttonGreen.position(600, 600);

  buttonRed.mousePressed(makeRed);
  buttonBlue.mousePressed(makeBlue);
  buttonGreen.mousePressed(makeGreen);

  strokeSlider = createSlider();
  strokeSlider.position(400, 650);

}

function firstRound(firstPh) {
  firstinstruction = createP("Draw this: " + firstPh, 10, 10);
  firstinstruction.position(600, 10)
}
 
function nextPlayer() {
  firstinstruction.hide();
  i++;
  socket.emit('nextround', i);
}

function roundStarted(phrase) {
  let instruction = createP("Draw this: " + phrase, 10, 10);
  instruction.position(600, 10)
}

let Py = 100;
function enteredGuess() {
  userGuess = captionInput.value();
  let Px = 1000;
  var guessP = createP(userGuess);
  guessP.position(Px, Py);
  Py += 20;
}

function draw() {
  textAlign(CENTER);
    if (userGuess == phrase) {
    fill(0)
    ellipse(100,100,10,10)
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

function mouseDragged() {

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