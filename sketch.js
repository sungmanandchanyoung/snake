var gridSize = 10;
var margin = 10;
var board = [];
var snake;
var velocity = 10;
var interval = velocity;
var food;
var length = 1;
var gameover = false;

function square(x, y) {
    this.x = x;
    this.y = y;

    this.display = function() {
        rect(
            ((width - 2 * margin) / gridSize) * this.x + margin,
            ((height - 2 * margin) / gridSize) * this.y + margin,
            ((width - 2 * margin) / gridSize) * (this.x + 1) + margin,
            ((height - 2 * margin) / gridSize) * (this.y + 1) + margin
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

    this.update = function() {
        if (interval < 0) {
	    if (this.move === true) {
		switch (this.moves[0]) {
                case 0:
                    this.x--;
		    this.move = false;
                    break;
                case 1:
                    this.y--;
		    this.move = false;
                    break;
                case 2:
                    this.x++;
		    this.move = false;
                    break;
                case 3:
                    this.y++;
		    this.move = false;
                    break;
		}
	    }
	    // Turn this.move as true
	    this.move = true;
	    if(this.moves.length > 1)
		this.moves.shift();
            interval = velocity;

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
        fill(255, 0, 0);
        for (var i = 0; i < this.body.length; i++) {
            rect(
                ((width - 2 * margin) / gridSize) * this.body[i].x + margin,
                ((height - 2 * margin) / gridSize) * this.body[i].y + margin,
                ((width - 2 * margin) / gridSize) * (this.body[i].x + 1) + margin,
                ((height - 2 * margin) / gridSize) * (this.body[i].y + 1) + margin
            );
        }
        noFill();
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
    // Gameboard
    fill(255, 255, 255);
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            board[j * gridSize + i].display();
        }
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
    switch (keyCode) {
        case LEFT_ARROW:
            if (snake.dir != 2) snake.moves.push(0);
            break;
        case UP_ARROW:
        if (snake.dir != 3) snake.moves.push(1);
            break;
        case RIGHT_ARROW:
        if (snake.dir != 0) snake.moves.push(2);
            break;
        case DOWN_ARROW:
        if (snake.dir != 1) snake.moves.push(3);
            break;
    }
}
