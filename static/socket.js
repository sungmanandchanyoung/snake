var socket = io();

// Promise : Synchronous function
var init = new Promise((resolve, reject) => {
    socket.emit("init", (data) => {
	if (data != null) {
	    console.log(data);
	    // If the returned "data" is not null, the "resolve" function will be called.
	    // At this point, the "resolve" function is NOT defined.
	    // It will be defined when this Promise function is called.
	    resolve(data);
	}
	else {
	    // If the "data" is null, the request to the server will be treated as faild.
	    // Finally the "reject" function will be called.
	    reject();
	}
    });
});





