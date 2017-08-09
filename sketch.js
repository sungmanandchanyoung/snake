var numOfGrids = 20; // var gridSize;
var margin = 10;
var board = [];
var velocity = 25;
var interval = velocity;
var snake;
var food;
var length = 1;
var gameover = false;


function setup() {
  createCanvas(600, 600);
  rectMode(CORNERS);
  for (var i = 0; i < numOfGrids; i++) {
    for (var j = 0; j < numOfGrids; j++) {
      board.push(new square({
        x: i,
        y: j
      }));
    }
  }
  // Default values
  // x : int(random(numOfGrids))
  // y : int(random(numOfGrids))
  food = new square();

  // Default values
  // x   : numOfGrids / 2,
  // y   : numOfGrids / 2,
  // dir : [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW][Math.floor(Math.random() * 4)]
  snake = new snake();
}

function draw() {
  background(51, 51, 51);
  // Gameboard
  fill(255, 255, 255);

  var gridlength = (width - 2 * margin) / numOfGrids;
  for (var i = 0; i < numOfGrids + 1; i++) {
    line(margin + i * gridlength, margin, margin + i * gridlength, height - margin);
    line(margin, margin + i * gridlength, width - margin, margin + i * gridlength);
  }

  // Food
  fill(0, 0, 255);
  food.display();
  noFill();

  // Snake
  snake.update();
  snake.display();
  interval--;

  if (gameover) {
    fill(255, 0, 0);
    rect(0, 0, width, height);
  }
}

function square(params) {
  params = Object.assign({}, {
    x: int(random(numOfGrids)),
    y: int(random(numOfGrids))
  }, params);

  this.x = params.x;
  this.y = params.y;

  this.display = function() {
    stroke(0, 0, 0);
    rect(
      x_co(this.x),
      y_co(this.y),
      x_co(this.x + 1),
      y_co(this.y + 1)
    );
  }
}

function keyPressed() {
  var last = snake.moves[snake.moves.length - 1];
  switch (keyCode) {
    case LEFT_ARROW:
      if (last != RIGHT_ARROW && last != LEFT_ARROW) snake.moves.push(LEFT_ARROW);
      break;
    case UP_ARROW:
      if (last != DOWN_ARROW && last != UP_ARROW) snake.moves.push(UP_ARROW);
      break;
    case RIGHT_ARROW:
      if (last != LEFT_ARROW && last != RIGHT_ARROW) snake.moves.push(RIGHT_ARROW);
      break;
    case DOWN_ARROW:
      if (last != UP_ARROW && last != DOWN_ARROW) snake.moves.push(DOWN_ARROW);
      break;
  }
}

function y_co(y) {
  return ((height - 2 * margin) / numOfGrids) * y + margin;
}

function x_co(x) {
  return ((width - 2 * margin) / numOfGrids) * x + margin;
}
