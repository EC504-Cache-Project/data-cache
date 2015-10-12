// ++++++++++++++++++++++++++++++++++++++++++++

// required libraries
var siofu = require('socketio-file-upload');
var dl = require('delivery');
var express = require('express');  
var app = express().use(siofu.router);  
var server = require('http').createServer(app); 
var io = require('socket.io')(server);
var port = 8080;

// ++++++++++++++++++++++++++++++++++++++++++++

// app setup
app.use("/css", express.static(__dirname + '/css'));

// route handler ======================
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// +++++++++++++++++++++++++++++++++++++++++++++

// socket handler =====================
io.on('connection', function(socket){

    // log new client connection
    console.log('New connection:', socket.request.connection._peername);

    // var delivery = dl.listen(socket);
    // delivery.on('delivery.connect',function(delivery){
    //     console.log('watttt');
    // });

    // log user dc events
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    /* Upload Files */
    // listen on socket for uploads
    var uploader = new siofu();
    uploader.dir = __dirname + "/uploads";
    uploader.listen(socket);

    // file uploader saved event
    uploader.on("saved", function(event){
        console.log("Client has successfully uploaded a file to the server.");
    });

    // file uploader error handler
    uploader.on("error", function(event){
        console.log("Error uploading file: ", event);
    });

});

// +++++++++++++++++++++++++++++++++++++++++++++

// server setup =======================
server.listen(port, function(){
  console.log('Server is listening on port '+ port);
});