// Dependencies
var express = require("express");
var app = express();
var path = require("path");
var session = require("express-session")({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
	secure: false
    }
});
var sharedSession = require("express-socket.io-session");

app.set('port', (process.env.PORT || 5000));
var server = app.listen(app.get('port'), function() {
    console.log("[SERVER RUNNING ON PORT " + app.get('port') + "] [" + new Date() + "]");
});
var io = require("socket.io").listen(server);


// Setup to share the session between Express & Socket.io
app.use(session);
io.use(sharedSession(session));

// Point the paths to serve static files
app.use("/libraries", express.static(path.join(__dirname, "libraries")));
app.use("/static", express.static(path.join(__dirname, "static")));

// Game attribues
var numOfGrids = 20;
var velocity = 1000;
var foods = [];
var snakes = {};


// Socket
io.on("connect", (socket) => {
    console.log("User[" + socket.handshake.session.id + "] [" + new Date() + "]");

    socket.on("init", (callback) => {
	var x = Math.floor(Math.random() * numOfGrids);
	var y = Math.floor(Math.random() * numOfGrids);
	snakes[socket.handshake.session.id] = {
	    // x: x,
	    // y: y,
	    velocity: velocity,
	    t_0: Date.now() % velocity,
	    moves: [Math.floor(Math.random() * 4 + 37)],
	    body: [{
		x: x,
		y: y
	    }]
	};
	
	foods.push({
	    x: Math.floor(Math.random()*numOfGrids),
	    y: Math.floor(Math.random()*numOfGrids)
	});
	
	socket.broadcast.emit("newUser", {
	    id: socket.handshake.session.id,
	    snake: snakes[socket.handshake.session.id],
	    food: foods[foods.length - 1]
	});
	
	callback({
	    id: socket.handshake.session.id,
	    numOfGrids: numOfGrids,
	    snakes: snakes,
	    foods: foods
	});
    });

    socket.on("heartbeat", (body) => {
	if (snakes[socket.handshake.session.id]){
	    snakes[socket.handshake.session.id].body = body;
	    socket.broadcast.emit("heartbeat", {
		id: socket.handshake.session.id,
		body: snakes[socket.handshake.session.id].body
	    });
	}
    });

    socket.on("changeDir", (moves) => {
	if (!snakes[socket.handshake.session.id]) return;
	snakes[socket.handshake.session.id].moves = moves;
	
	socket.broadcast.emit("changeDir", {
	    id: socket.handshake.session.id,
	    moves: snakes[socket.handshake.session.id].moves
	});
    });
    
    socket.on("disconnect", function() {
	socket.broadcast.emit("disconnected", socket.handshake.session.id);
	delete snakes[socket.handshake.session.id];
    });
});

app.get("/", function(request, response, next) {
    response.sendFile("index.html", {root: __dirname + "/static/"}, function(error) {
	if (error) next(error);
    });
});
