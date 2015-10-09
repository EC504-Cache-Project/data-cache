// init setup ==============================
var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server);
var port = 8080;

// app setup ================================
app.use("/css", express.static(__dirname + '/css'));

// route handler ======================
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// socket handler =====================
io.on('connection', function(socket){
  socket.on('message', function(msg){
    io.emit('message', msg);
  });

  
});

// server setup =======================
server.listen(port, function(){
  console.log('Server is listening on port '+ port);
});