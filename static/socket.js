var socket = io();

var init = new Promise((resolve, reject) => {
    socket.emit("init", (data) => {
	if (data != null) {
	    console.log("init data");
	    console.log(data);
	    // If the returned "data" is not null, the "resolve" function will be called.
	    // At this point, the "resolve" function is NOT defined.
	    // It will be defined when this Promise function is called.
	    resolve(data);
	}
	else {
	    // If the "data" is null, the request to the server will be treated as failed.
	    // Finally the "reject" function will be called.
	    reject();
	}
    });
});

socket.on("disconnected", (data) => {
    delete snakes[data];
});

socket.on("init", (data) => {
    snakes[data.id] = new Snake({
	x: data.snake.x,
	y: data.snake.y,
	velocity: data.snake.velocity,
	moves: data.snake.moves
    });
    foods.push(new Square({
	x: data.food.x,
	y: data.food.y
    }));
});

function changeDir(data) {
    socket.emit("changeDir", data);
}

socket.on("changeDir", (data) => {
    snakes[data.id].moves = data.moves;
});

function heartbeat() {
}
