var numOfGrids = 1;
var margin = 10;
var board = [];
var id = 0;
var foods = [];
var myIndex;
var snakes = {};
var gameover = false;

function preload() {
    init
    // The lambda function inside of ".then()" will be the "resolve" function
	.then((data) => {
	    // Initialize variables
	    id = data.id;
	    numOfGrids = data.numOfGrids;

	    // Snakes
	    for(var i in data.snakes) {
		snakes[i] = new Snake({
		    x: data.snakes[i].x,
		    y: data.snakes[i].y,
		    velocity: data.snakes[i].velocity,
		    moves: data.snakes[i].moves
		});
	    }

	    // Foods
	    for (var i = 0; i < data.foods.length; i++) {
		foods.push(new Square({
		    x : data.foods[i].x,
		    y : data.foods[i].y
		}));
	    }
	})

    // The lambda function inside of ".catch()" will be the "reject" function
	.catch((reason) => {
	    console.log("ERROR");
	    console.log(reason);
	});
}

function setup() {
    createCanvas(600, 600);
    rectMode(CORNERS);
    for (var i = 0; i < numOfGrids; i++) {
	for (var j = 0; j < numOfGrids; j++) {
	    board.push(new Square({
		x: i,
		y: j
	    }));
	}
    }
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

    // Foods
    fill(0, 0, 255);
    for(var i = 0; i < foods.length; i++) {
	foods[i].display();
    }

    // Snakes
    fill(255, 0, 0);
    for(var i in snakes) {
	snakes[i].update();
	snakes[i].display();
    }
    
    if (gameover) {
	// fill(255, 0, 0);
	// rect(0, 0, width, height);
    }
}

function keyPressed() {
    var snake = snakes[id];
    var lastMove = snake.moves[snake.moves.length - 1];
    switch (keyCode) {
    case LEFT_ARROW:
	if (lastMove != RIGHT_ARROW && lastMove != LEFT_ARROW) snake.moves.push(LEFT_ARROW);
	break;
    case UP_ARROW:
	if (lastMove != DOWN_ARROW && lastMove != UP_ARROW) snake.moves.push(UP_ARROW);
	break;
    case RIGHT_ARROW:
	if (lastMove != LEFT_ARROW && lastMove != RIGHT_ARROW) snake.moves.push(RIGHT_ARROW);
	break;
    case DOWN_ARROW:
	if (lastMove != UP_ARROW && lastMove != DOWN_ARROW) snake.moves.push(DOWN_ARROW);
	break;
    }
    changeDir(snake.moves);
}

function y_co(y) {
    return ((height - 2 * margin) / numOfGrids) * y + margin;
}

function x_co(x) {
    return ((width - 2 * margin) / numOfGrids) * x + margin;
}

function Square(params) {
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
