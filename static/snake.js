// Separated from 'sketch.js' for better readability.

function Snake(params) {
    this.x = params.x;
    this.y = params.y;
    this.velocity = params.velocity;
    this.interval = this.velocity;
    this.interval_bridge = 1;
    this.t_0 = performance.now();
    this.moves = params.moves;
    this.grow = false;

    this.body = [{
	x: this.x,
	y: this.y
    }];

    // this.tail and head_prev is to remember the snake.head_prev box for animation
    this.tail_prev = 0;
    this.tail_now = 0;
    this.head_prev = 0;
    this.head_now = 0;

    // Allows the snake to store a sequence of moves to be moved each square
    this.move = true;

    this.update = function() {
	if (this.interval < 0) {
	    if (this.moves.length > 1 && this.move)
		this.moves.shift();
	    this.move = false;

	    if (this.moves.length == 1)
		this.move = true;

	    switch (this.moves[0]) {
            case LEFT_ARROW:
		this.x--;
		break;
            case UP_ARROW:
		this.y--;
		break;
            case RIGHT_ARROW:
		this.x++;
		break;
            case DOWN_ARROW:
		this.y++;
		break;
	    }
	    // Turn this.move as true
	    if (this.moves.length > 1) this.moves.shift();

	    this.interval_bridge += (int(Math.abs(this.interval / this.velocity)) + 1);
	    this.interval = (this.t_0 - performance.now()) + this.interval_bridge * this.velocity;
	    
	    this.tail_prev = this.body[0];
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

	    for (var i = 0; i < this.body.length - 1; i++) {
		if (this.x == this.body[i].x && this.y == this.body[i].y) {
		    gameover = true;
		}
	    }

	    if (this.x >= numOfGrids || this.y >= numOfGrids || this.x < 0 || this.y < 0) {
		gameover = true;
	    }
	}

	this.interval = this.t_0 - performance.now() + this.interval_bridge * this.velocity;
    };

    this.display = function() {
	this.tail_now = this.body[0];
	this.head_now = this.body[this.body.length - 1];
	
	switch (true) { // Drawing tail
	case (this.tail_now.x < this.tail_prev.x) : // Left
	    rect(
		x_co(lerp(this.tail_prev.x, this.tail_now.x, 1 - this.interval / this.velocity) + 1),
		y_co(this.tail_prev.y),
		x_co(this.tail_prev.x),
		y_co(this.tail_prev.y + 1)
	    );
	    break;
	case (this.tail_now.x > this.tail_prev.x) : // Right
	    rect(
		x_co(lerp(this.tail_prev.x, this.tail_now.x, 1 - this.interval / this.velocity)),
		y_co(this.tail_prev.y),
		x_co(this.tail_now.x),
		y_co(this.tail_prev.y + 1)
	    );
	    break;
	case (this.tail_now.y < this.tail_prev.y) : // Up
	    rect(
		x_co(this.tail_prev.x),
		y_co(this.tail_prev.y),
		x_co(this.tail_prev.x + 1),
		y_co(lerp(this.tail_prev.y, this.tail_now.y, 1 - this.interval / this.velocity) + 1)
	    );
	    break;
	case (this.tail_now.y > this.tail_prev.y) : // Down
	    rect(
		x_co(this.tail_prev.x),
		y_co(this.tail_now.y),
		x_co(this.tail_prev.x + 1),
		y_co(lerp(this.tail_prev.y, this.tail_now.y, 1 - this.interval / this.velocity))
	    );
	    break;
	}

	/**
	   Drawing head
	*/
	// left
	if (this.head_now.x < this.head_prev.x)
	    rect(
		x_co(this.head_prev.x),
		y_co(this.head_prev.y),
		x_co(lerp(this.head_prev.x, this.head_now.x, 1 - this.interval / this.velocity)),
		y_co(this.head_prev.y + 1) // y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity) + 1)
	    );
	// right
	if (this.head_now.x > this.head_prev.x)
	    rect(
		x_co(this.head_prev.x + 1),
		y_co(this.head_prev.y),
		x_co(lerp(this.head_prev.x, this.head_now.x, 1 - this.interval / this.velocity) + 1),
		y_co(this.head_prev.y + 1) // y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity) + 1)
	    );
	// up
	if (this.head_now.y < this.head_prev.y)
	    rect(
		x_co(this.head_prev.x),
		y_co(this.head_prev.y),
		x_co(this.head_prev.x + 1), // x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity) + 1),
		y_co(lerp(this.head_prev.y, this.head_now.y, 1 - this.interval / this.velocity))
	    );
	// down
	if (this.head_now.y > this.head_prev.y)
	    rect(
		x_co(this.head_prev.x),
		y_co(this.head_prev.y + 1),
		x_co(this.head_prev.x + 1), // x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity) + 1),
		y_co(lerp(this.head_prev.y, this.head_now.y, 1 - this.interval / this.velocity) + 1)
	    );
	/**
	   Drawing body
	*/
	for (var i = 0; i < this.body.length - 1; i++) {
	    rect(
		x_co(this.body[i].x),
		y_co(this.body[i].y),
		x_co(this.body[i].x + 1),
		y_co(this.body[i].y + 1)
	    );
	}
    };
}
