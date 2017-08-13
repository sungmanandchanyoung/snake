// Dependencies
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
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


// Server port
var port = 3000;
http.listen(port, function() {
    console.log("[SERVER RUNNING ON PORT " + port + "] [" + new Date() + "]");
});


// Setup to share the session between Express & Socket.io
app.use(session);
io.use(sharedSession(session));

// Point the paths to serve static files
app.use("/libraries", express.static(path.join(__dirname, "libraries")));
app.use("/static", express.static(path.join(__dirname, "static")));

// Game attribues
var numOfGrids = 20;
var velocity = 30;
var foods = [];
var snakes = [];

// Socket
io.on("connect", function(socket) {
    console.log("User : " + socket.handshake.session.id);
    console.log("Connected : " + new Date());

    // Once client emits "init" event, the server will create new snake & food objects, and push them into the each arrays.
    socket.on("init", (callback) => {
	snakes.push({
	    id: socket.handshake.session.id,
	    x: Math.floor(Math.random()*numOfGrids),
	    y: Math.floor(Math.random()*numOfGrids),
	    dir: Math.floor(Math.random() * (40 - 37 + 1) + 37)
	});
	
	foods.push({
	    x: Math.floor(Math.random()*numOfGrids),
	    y: Math.floor(Math.random()*numOfGrids)
	});

	// Finally the server will return the JSON data as parameter of "callback" function.
	callback({
	    id : socket.handshake.session.id,
	    numOfGrids : numOfGrids,
	    velocity : velocity,
	    snakes : snakes,
	    foods : foods
	});
    });

    


    socket.on("playing", function() {
	io.emit("playing", {
	    snakes: snakes,
	    foods :foods,
	});
    });

    
    socket.on("disconnect", function() {
    });
});

var OPTIONS = {
    root: __dirname + "/static/"
};


app.get("/", function(request, response, next) {
    response.sendFile("index.html", OPTIONS, function(error) {
	if (error)
	    next(error);
    });
});


