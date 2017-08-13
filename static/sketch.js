var numOfGrids = 1;
var margin = 10;
var board = [];
var velocity = 0;
var interval = velocity;
var id = 0;
var snake = new Snake({
    x: 0,
    y: 0,
    dir: 0
});
var foods = [];
var snakes = [];
var gameover = false;

function preload() {
    init
        // The function inside of ".then()" will be the "resolve" function
	.then((data) => {

	    // Initialize variables
	    numOfGrids = data.numOfGrids;
	    velocity = data.velocity;
	    interval = velocity;
	    id = data.id;
	    
	    // Snakes
	    for (var i = 0; i < data.snakes.length; i++) {
		switch(data.snakes[i].id == id) {
		case true: 
		    snake = new Snake({
    			x : data.snakes[i].x,
    			y : data.snakes[i].y,
    			dir: data.snakes[i].dir
		    });
		    break;
		case false:
		    snakes.push(new Snake({
			x : data.snakes[i].x,
    			y : data.snakes[i].y,
    			dir: data.snakes[i].dir
		    }));
		    break;
		}
	    }
	    
	    // Foods
	    for(var i = 0; i < data.foods.length; i++) {
		foods.push(new square({
		    x : data.foods[i].x,
		    y :data.foods[i].y
		}));
	    }
	})

        // The function inside of ".catch()" will be the "reject" function
	.catch(() => {
	    console.log("ERROR");
	});
}

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
    for(var i = 0; i < snakes.length; i++) {
	snakes[i].update();
	snakes[i].display();
    }

    // My snake
    fill(0, 255, 0);
    snake.update();
    snake.display();

    interval--;

    if (gameover) {
	// fill(255, 0, 0);
	// rect(0, 0, width, height);
    }
}

function square(params) {
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
}

function y_co(y) {
    return ((height - 2 * margin) / numOfGrids) * y + margin;
}

function x_co(x) {
    return ((width - 2 * margin) / numOfGrids) * x + margin;
}
