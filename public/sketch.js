//client code - frontend
//cannot pull from node modules, those are only for backend

/* background colors - black, white
stroke colors - red, blue, green, white, black, orange, yellow, purple, pink ?
stroke size slider X
emojis - heart, smiley X
random color button ? */

var socket;
var buttonRed, buttonBlue, buttonGreen, buttonHeart, buttonSmile;
var redVal = 255, greenVal = 0, blueVal = 0;
var slider;
var heart, smile;
var heartPressed = false, smilePressed = false;

function preload() {
  heart = loadImage('images/heart.png');
  smile = loadImage('images/smile.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('black');
  socket = io.connect('https://drawing-app-advcoding.herokuapp.com/:3000');

  //handle the broadcast calls
  socket.on('circle', newCircleDrawing);
  socket.on('emoji', newEmojiDrawing);

  buttonRed = select('#Red');
  buttonBlue = select('#Blue');
  buttonGreen = select('#Green');
  buttonHeart = select('#Heart');
  buttonSmile = select('#Smile');

  buttonRed.mousePressed(makeRed);
  buttonBlue.mousePressed(makeBlue);
  buttonGreen.mousePressed(makeGreen);
  buttonHeart.mousePressed(makeHeart);
  buttonSmile.mousePressed(makeSmile);

  slider = createSlider();
  slider.position(300, 0);
}

function makeRed() {
  redVal = 255;
  greenVal = 0;
  blueVal = 0;
  heartPressed = false;
  smilePressed = false;
}

function makeBlue() {
  redVal = 0;
  greenVal = 0;
  blueVal = 255;
  heartPressed = false;
  smilePressed = false;
}

function makeGreen() {
  redVal = 0;
  greenVal = 255;
  blueVal = 0;
  heartPressed = false;
  smilePressed = false;
}

function makeHeart() {
  heartPressed = true;
  smilePressed = false;
}

function makeSmile() {
  heartPressed = false;
  smilePressed = true;
}

function newCircleDrawing(data) {
  stroke(data.r, data.g, data.b);
  strokeWeight(data.size);
  line(data.x, data.y, data.x + 1, data.y + 1)
}

function newEmojiDrawing(data) {
  if (data.img == 1) {
    image(smile, data.x, data.y, data.sizeES, data.sizeES);
  } else if (data.img == 2) {
    image(heart, data.x, data.y, data.sizeEH, data.sizeEH);
  }
}

function mouseDragged() {
  if (heartPressed) {
    image(heart, mouseX, mouseY, slider.value(), slider.value());
    var data = {
      x: mouseX,
      y: mouseY,
      sizeEH: slider.value(),
      img: 2
    }
  } else if (smilePressed) {
    image(smile, mouseX, mouseY, slider.value(), slider.value());
    var data = {
      x: mouseX,
      y: mouseY,
      sizeES: slider.value(),
      img: 1
    }
  } else {
    stroke(redVal, greenVal, blueVal);
    strokeWeight(slider.value());
    line(mouseX, mouseY, (mouseX + 1), (mouseY + 1));

    //data is what the sockets send to each other
    //object literal notation
    var data = {
      x: mouseX,
      y: mouseY,
      r: redVal,
      g: greenVal,
      b: blueVal,
      size: slider.value()
    }
  }
  //console.log(heartPressed, smilePressed);

  socket.emit('circle', data);
  socket.emit('emoji', data);
}
