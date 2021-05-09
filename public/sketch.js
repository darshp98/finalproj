var socket;
var captionInput, givenPhrases, userGuess, showUserGuess, submitButton, nextButton;
var timer = 60;
//drawing
var buttonRed, buttonBlue, buttonGreen;
var redVal = 255, greenVal = 0, blueVal = 0;
var strokeSlider;
var i = 0;

//next button to start the next round, shows pop up to next player in array their word, timer starts; simple enter into input, replies right or wrong

function setup() {
  createCanvas(500,500);

  socket = io.connect('http://localhost:3000');
  socket.on('userguesses', showGuesses);
  socket.on('drawing', showDrawing);
  socket.on('roundstart', roundStarted);

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

function nextPlayer(){
  socket.emit('roundstart', i);
}

function roundStarted(phrase) {
  console.log(phrase)
}

function showdrawertext() {
  timer --;
}

function draw() {
  textAlign(CENTER);
}

function enteredGuess() { // works
  userGuess = captionInput.value();
  socket.emit('userguesses', userGuess);
}

function showGuesses(data) { //not working
  showUserGuess = str(data);
  console.log('yay: ' + showUserGuess)
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