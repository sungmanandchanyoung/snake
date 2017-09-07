var socket = io();
var tempTail = {};
var tempHead = {};
var tempBody = {};
var tempBool = {};

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

function heartbeat(data) {
    socket.emit("heartbeat", data);
}

socket.on("heartbeat", (data) => {

    tempTail[data.id] = data.tail_prev;
    tempHead[data.id] = data.head_prev;
    tempBody[data.id] = data.body;
    tempBool[data.id] = true;
});

function changeDir(moves) {
    socket.emit("changeDir", moves);
}

socket.on("changeDir", (data) => {
    if(snakes[data.id])
	snakes[data.id].moves = data.moves;
});
