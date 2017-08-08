var gridSize = 100;
var margin = 10;
var board = [];
var snake;
var velocity = 1;
var interval = velocity;
var food;
var length = 1;
var gameover = false;

function square(x, y) {
    this.x = x;
    this.y = y;

    this.display = function() {
        rect(
	    x_co(this.x),
	    y_co(this.y),
	    x_co(this.x + 1),
	    y_co(this.y + 1)
        );
    };
}

function snakeClass(x, y, dir) {
    this.x = x;
    this.y = y;

    // 수정한 부분
    this.body = [{
        x: this.x,
        y: this.y
    }];

    // Allows the snake to store a sequence of moves to be moved each square
    this.moves = [dir];
    this.move = true;

    //    this.dir = dir;
    this.grow = false;

    // this.tail and head_prev is to remember the snake.head_prev box for animation
    this.tail = 0;
    this.head_prev = 0;
    this.head_now = 0;

    this.update = function() {
        if (interval < 0) {
	    if(this.moves.length > 1 && this.move)
		this.moves.shift();
		this.move = false;
	    
	    if(this.moves.length ==1)
		this.move = true;
	    switch (this.moves[0]) {
            case 0:
                this.x--;
                break;
            case 1:
                this.y--;
                break;
            case 2:
                this.x++;
                break;
            case 3:
                this.y++;
                break;
	    }
	    // Turn this.move as true
	    if(this.moves.length > 1)
		this.moves.shift();
            interval = velocity;

	    this.tail = this.body[0];
	    this.head_prev = this.body[this.body.length - 1];
	    
            switch (this.grow) {
            case true:
                this.grow = false;
                break;
            case false:
                (this.body).shift();
                break;

            }

	    
            (this.body).push({
                x: this.x,
                y: this.y
            });

            if (this.x == food.x && this.y == food.y) {
                length++;
                this.grow = true;
                food.x = int(random(gridSize));
                food.y = int(random(gridSize));
            }

            for (var i = 0; i < this.body.length - 1; i++) {
                if (this.x == this.body[i].x && this.y == this.body[i].y) {
                    gameover = true;
                }
            }

            if (this.x >= gridSize || this.y >= gridSize || this.x < 0 || this.y < 0) {
                gameover = true;
            }
        }
    };

    this.display = function() {
	this.head_now = this.body[this.body.length - 1];
	
	noStroke();
        fill(255, 0, 0);

	// drawing tail
	if(this.body[0].x > this.tail.x)
            rect(
		x_co(lerp(this.tail.x, this.body[0].x, 1 - interval / velocity)),
		y_co(lerp(this.tail.y, this.body[0].y, 1 - interval / velocity)),
		x_co((this.body[0].x)),
		y_co((this.body[0].y + 1))
            );
	else if(this.body[0].x < this.tail.x)
            rect(
		x_co(lerp(this.tail.x, this.body[0].x, 1 - interval / velocity) + 1),
		y_co(lerp(this.tail.y, this.body[0].y, 1 - interval / velocity)),
		x_co((this.body[0].x) + 1),
		y_co((this.body[0].y + 1))
            );
	else if(this.body[0].y > this.tail.y)
	    rect(
		x_co(this.body[0].x),
		y_co(this.body[0].y),
		x_co((lerp(this.tail.x, this.body[0].x, 1 - interval / velocity) + 1)),
		y_co(lerp(this.tail.y, this.body[0].y, 1 - interval / velocity))
            );
	else if(this.body[0].y < this.tail.y)
	    rect(
		x_co(this.body[0].x),
		y_co(this.body[0].y + 1),
		x_co((lerp(this.tail.x, this.body[0].x, 1 - interval / velocity) + 1)),
		y_co(lerp(this.tail.y, this.body[0].y, 1 - interval / velocity) + 1)
            );

	// drawing head_now
	if(this.head_prev.x > this.head_now.x)
            rect(
		x_co(this.head_prev.x),
		y_co(this.head_prev.y),
		x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity)),
		y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity) + 1)
            );
	else if(this.head_prev.x < this.head_now.x)
            rect(
		x_co(this.head_prev.x + 1),
		y_co(this.head_prev.y),
		x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity) + 1),
		y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity) + 1)
            );
	else if(this.head_prev.y > this.head_now.y)
	    rect(
		x_co(this.head_prev.x),
		y_co(this.head_prev.y),
		x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity) + 1),
		y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity))
            );
	else if(this.head_prev.y < this.head_now.y)
	    rect(
		x_co(this.head_prev.x),
		y_co(this.head_prev.y + 1),
		x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity) + 1),
		y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity) + 1)
            );
	
	
	// draw top left corner of head_prev
	// fill(255,0,0);
	// ellipse(
	//     x_co(this.head_now.x),
	//     y_co(this.head_now.y),
	//     10,
	//     10);
	// fill(0,255,0, 100);
	// ellipse(
	//     x_co(this.head_prev.x),
	//     y_co(this.head_prev.y),
	//     10,
	//     10);

	// // drawing actual head_prev
	// fill(0, 255, 0, 50);
	// rect(
	//     x_co(this.head_now.x),
	//     y_co(this.head_now.y),
	//     x_co(this.head_now.x + 1),
	//     y_co(this.head_now.y + 1)
        // );
	// 
	// rect(
	//     x_co(this.head_prev.x),
	//     y_co(this.head_prev.y),
	//     x_co(this.head_prev.x + 1),
	//     y_co(this.head_prev.y + 1)
	// );

	// draw the body
        for (var i = 0; i < this.body.length - 1; i++) {
            rect(
		x_co(this.body[i].x),
		y_co(this.body[i].y),
		x_co(this.body[i].x + 1),
		y_co(this.body[i].y + 1)
            );
        }
        noFill();
	stroke(0,0,0);
    };
}

function setup() {
    createCanvas(600, 600);
    rectMode(CORNERS);
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            board.push(new square(i, j));
        }
    }
    food = new square(int(random(gridSize)), int(random(gridSize)));
    snake = new snakeClass(gridSize / 2, gridSize / 2, int(random(4)));
}

function draw() {
    background(255);
    //    Gameboard
    fill(255, 255, 255);

    var gridlength = (width - 2 * margin) / gridSize;
    for (var i = 0; i < gridSize + 1; i++) {
	line(margin + i * gridlength, margin, margin + i * gridlength, height - margin);
    }
    for (var i = 0; i < gridSize + 1; i++) {
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

function keyPressed() {
    var last = snake.moves[snake.moves.length - 1];
    switch (keyCode) {
        case LEFT_ARROW:
            if (last != 2 && last != 0) snake.moves.push(0);
            break; 
        case UP_ARROW:
        if (last != 3 && last != 1) snake.moves.push(1);
            break;
        case RIGHT_ARROW:
        if (last != 0 && last != 2) snake.moves.push(2);
            break;
        case DOWN_ARROW:
        if (last != 1 && last != 3) snake.moves.push(3);
            break;
    }
}

function y_co(y) {
    return ((height - 2 * margin) / gridSize) * y + margin;
}

function x_co(x) {
    return ((width - 2 * margin) / gridSize) * x + margin;
}
