var socket = io();

socket.on("disconnected", (id) => {
    delete snakes[id];
});

var init = new Promise((resolve, reject) => {
    socket.emit("init", (data) => {
	// If the returned "data" is not null, the "resolve" function will be called.
	// At this point, the "resolve" function is NOT defined.
	// It will be defined when this Promise function is called.
	if (data != null) {
	    resolve(data);
	    setInterval(() => {
		socket.emit("heartbeat", {
		    id: id,
		    snake: snakes[id]
		});
	    }, 50);
	}
	
	// If the "data" is null, the request to the server will be treated as failed.
	// Finally the "reject" function will be called.
	else reject();
    });
});

socket.on("newUser", (data) => {
    snakes[data.id] = new Snake({
	x: data.snake.x,
	y: data.snake.y,
	velocity: data.snake.velocity,
	t_0: data.snake.t_0,
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
