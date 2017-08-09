// Separated from 'sketch.js' for better readability.

function snake(params) {

  params = Object.assign({}, {
    x: numOfGrids / 2,
    y: numOfGrids / 2,
    dir: [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW][Math.floor(Math.random() * 4)]
  }, params);

  this.x = params.x;
  this.y = params.y;
  this.moves = [params.dir];
  this.grow = false;

  this.body = [{
    x: this.x,
    y: this.y
  }];

  // this.tail and head_prev is to remember the snake.head_prev box for animation
  this.tail_prev = 0; // Created to promote consistency of naming convention
  this.tail_now = 0; // Created to promote consistency of naming convention
  this.head_prev = 0;
  this.head_now = 0;

  // Allows the snake to store a sequence of moves to be moved each square
  this.move = true;

  this.update = function() {
    if (interval < 0) {
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
      if (this.moves.length > 1)
        this.moves.shift();
      interval = velocity;


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

      if (this.x == food.x && this.y == food.y) {
        length++;
        this.grow = true;
        food.x = int(random(numOfGrids));
        food.y = int(random(numOfGrids));
      }

      for (var i = 0; i < this.body.length - 1; i++) {
        if (this.x == this.body[i].x && this.y == this.body[i].y) {
          gameover = true;
        }
      }

      if (this.x >= numOfGrids || this.y >= numOfGrids || this.x < 0 || this.y < 0) {
        gameover = true;
      }
    }
  }

  this.display = function() {
    this.tail_now = this.body[0];
    this.head_now = this.body[this.body.length - 1];
    noStroke();
    fill(255, 0, 0);

    /**
    Drawing tail
    */
    // left
    if (this.tail_now.x < this.tail_prev.x)
      rect(
        x_co(lerp(this.tail_prev.x, this.tail_now.x, 1 - interval / velocity) + 1),
        y_co(this.tail_prev.y), // y_co(lerp(this.tail.y, this.body[0].y, 1 - interval / velocity)),
        x_co(this.tail_prev.x),
        y_co(this.tail_prev.y + 1)
      );
    // right
    if (this.tail_now.x > this.tail_prev.x)
      rect(
        x_co(lerp(this.tail_prev.x, this.tail_now.x, 1 - interval / velocity)),
        y_co(this.tail_prev.y), // y_co(lerp(this.tail.y, this.body[0].y, 1 -interval / velocity)),
        x_co(this.tail_now.x),
        y_co(this.tail_prev.y + 1)
      );
    // up
    if (this.tail_now.y < this.tail_prev.y)
      rect(
        x_co(this.tail_prev.x),
        y_co(this.tail_prev.y),
        x_co(this.tail_prev.x + 1), // x_co((lerp(this.tail.x, this.body[0].x, 1 - interval / velocity) + 1)),
        y_co(lerp(this.tail_prev.y, this.tail_now.y, 1 - interval / velocity) + 1)
      );
    // down
    if (this.tail_now.y > this.tail_prev.y)
      rect(
        x_co(this.tail_prev.x),
        y_co(this.tail_now.y),
        x_co(this.tail_prev.x + 1), // x_co((lerp(this.tail.x, this.body[0].x, 1 - interval / velocity) + 1)),
        y_co(lerp(this.tail_prev.y, this.tail_now.y, 1 - interval / velocity))
      );

    /**
    Drawing head
    */
    // left
    if (this.head_now.x < this.head_prev.x)
      rect(
        x_co(this.head_prev.x),
        y_co(this.head_prev.y),
        x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity)),
        y_co(this.head_prev.y + 1) // y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity) + 1)
      );
    // right
    if (this.head_now.x > this.head_prev.x)
      rect(
        x_co(this.head_prev.x + 1),
        y_co(this.head_prev.y),
        x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity) + 1),
        y_co(this.head_prev.y + 1) // y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity) + 1)
      );
    // up
    if (this.head_now.y < this.head_prev.y)
      rect(
        x_co(this.head_prev.x),
        y_co(this.head_prev.y),
        x_co(this.head_prev.x + 1), // x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity) + 1),
        y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity))
      );
    // down
    if (this.head_now.y > this.head_prev.y)
      rect(
        x_co(this.head_prev.x),
        y_co(this.head_prev.y + 1),
        x_co(this.head_prev.x + 1), // x_co(lerp(this.head_prev.x, this.head_now.x, 1 - interval / velocity) + 1),
        y_co(lerp(this.head_prev.y, this.head_now.y, 1 - interval / velocity) + 1)
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
    noFill();
    stroke(0, 0, 0);
  }
}
