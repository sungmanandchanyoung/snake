var socket = io();
var temp = {};

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
	}
	
	// If the "data" is null, the request to the server will be treated as failed.
	// Finally the "reject" function will be called.
	else reject();
    });
});

socket.on("newUser", (data) => {
    snakes[data.id] = new Snake({
	// x: data.snake.x,
	// y: data.snake.y,
	color: [255, 0, 0],
	velocity: data.snake.velocity,
	t_0: data.snake.t_0,
	moves: data.snake.moves,
	body: data.snake.body
    });
    
    foods.push(new Square({
	x: data.food.x,
	y: data.food.y
    }));
});

function heartbeat(body) {
    socket.emit("heartbeat", body);
}

socket.on("heartbeat", (data) => {
    // temp[data.id] = data.body;
    if (snakes[data.id]) {
	// var length = snakes[data.id].body.length;
	// if (snakes[data.id].body[length - 1] != data.body[data.body.length - 1])
	snakes[data.id].body = data.body;
    }
    

});

function changeDir(moves) {
    socket.emit("changeDir", moves);
}

socket.on("changeDir", (data) => {
    if(snakes[data.id])
	snakes[data.id].moves = data.moves;
});
