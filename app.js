// required libraries ====================================
var SocketIOFileUpload = require('socketio-file-upload'),
    socketio = require('socket.io'),
    express = require('express');

// express app setup =====================================
var app = express()
    .use(SocketIOFileUpload.router)
    .use("/css", express.static(__dirname + '/css'))
    .get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
	})
    .listen(9090);

// socket handler =====================
// Start up Socket.IO:
var io = socketio.listen(app);
io.sockets.on("connection", function(socket){

    // Make an instance of SocketIOFileUpload and listen on this socket:
    var uploader = new SocketIOFileUpload();
    uploader.dir = "srv/uploads";
    uploader.listen(socket);

    // Do something when a file is saved:
    uploader.on("saved", function(event){
        console.log(event.file);
    });

    // Error handler:
    uploader.on("error", function(event){
        console.log("Error from uploader", event);
    });
});