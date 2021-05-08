//client code - frontend
//cannot pull from node modules, those are only for backend

var socket;
//screens
var home = true, phrasing = false, drawing = false, captioning = false;
//home screen
var playerDropdown, timeDropdown, buttonNext;
//phrase screen
var phraseInput, initialPhrases, otherUserPhrase, buttonSubmit, timer;
//drawing screen
var buttonRed, buttonBlue, buttonGreen;
var redVal = 255, greenVal = 0, blueVal = 0;
var strokeSlider;

function setup() {
  socket = io.connect('http://localhost:3000');

  //home screen
  playerDropdown = createSelect();
  timeDropdown = createSelect();
  buttonNext = select('#Next');

  buttonNext.mousePressed(phraseScreen);
  buttonNext.position(windowWidth / 2, 500);
  playerDropdown.position(windowWidth / 2, 300);
  playerDropdown.option(4);
  playerDropdown.option(5);
  playerDropdown.option(6);
  timeDropdown.position(windowWidth / 2, 400);
  timeDropdown.option(60);
  timeDropdown.option(90);
  timeDropdown.option(120);

  //phrase screen
  phraseInput = createInput('Enter a phrase!');
  buttonSubmit = select('#Submit');

  phraseInput.position(windowWidth / 2, 300);
  buttonSubmit.mousePressed(drawScreen);
  buttonSubmit.position(windowWidth / 2, 400);

  socket.on('firstPhrases', sendPhrase);

  //drawing screen
  buttonRed = select('#Red');
  buttonBlue = select('#Blue');
  buttonGreen = select('#Green');

  buttonRed.mousePressed(makeRed);
  buttonBlue.mousePressed(makeBlue);
  buttonGreen.mousePressed(makeGreen);

  strokeSlider = createSlider();
  strokeSlider.position(300, 0);

}

function draw() {
  createCanvas(windowWidth, windowHeight);

  if (home) {
    homeScreen();
  } else if (phrasing) {
    phraseScreen();
  } else if (drawing) {
    drawScreen();
  } else if (captioning) {
    captionScreen();
  }

}

function homeScreen() {
  background('grey');
  textAlign(CENTER)
  text("How many players:", windowWidth / 2, 275);
  text("How many seconds per round:", windowWidth / 2, 375);

  //hiding stuff from phrase and draw screens
  phraseInput.hide();
  buttonSubmit.hide();
  strokeSlider.hide();
  buttonRed.hide();
  buttonBlue.hide();
  buttonGreen.hide();

}

function phraseScreen() {
  home = false;
  phrasing = true;

  background('grey');
  phraseInput.show();
  buttonSubmit.show();

  // timer = timeDropdown.value();

  // if (frameCount % 60 == 0 && timer > 0) {
  //   timer--;
  // }

  // if (timer == 0) {
  //   phrasing = false;
  //   drawing = true;
  // }

  //hiding stuff from home and draw screens
  playerDropdown.hide();
  timeDropdown.hide();
  buttonNext.hide();
  strokeSlider.hide();
  buttonRed.hide();
  buttonBlue.hide();
  buttonGreen.hide();

}

function sendPhrase(data) {
  otherUserPhrase = str(data);
}

function drawScreen(points) {

  initialPhrases = phraseInput.value();
  socket.emit('firstPhrases', initialPhrases);

  home = false;
  phrasing = false;
  drawing = true;
  background('grey');
  textAlign(CENTER);
  text("Draw this:", windowWidth / 2, 50);
  text(otherUserPhrase, windowWidth / 2, 70);

  // stroke(points.r, points.g, points.b);
  // strokeWeight(points.size);
  // line(points.x, points.y, points.x + 1, points.y + 1);

  strokeSlider.show();
  buttonRed.show();
  buttonBlue.show();
  buttonGreen.show();

  //hiding stuff from home and phrase screens
  playerDropdown.hide();
  timeDropdown.hide();
  buttonNext.hide();
  phraseInput.hide();
  buttonSubmit.hide();

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

  if (drawing) {
    stroke(redVal, greenVal, blueVal);
    strokeWeight(slider.value());
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
  }
}
//session id- when u get new connection, that is the id, need to register w session id, server.onconnection, array of players, affiliate player w their session id, sending it by using session id  