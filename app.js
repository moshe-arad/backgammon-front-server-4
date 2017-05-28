var express = require("express");
var app = express();
var request = require('request');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
var engines = require('consolidate');

app.use(express.static('static'));
app.set('views','./static');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

//login logout route
var authRouter = require("./routers/auth");
app.use(authRouter);

//lobby route
var lobbyRouter = require("./routers/lobby");
app.use(lobbyRouter);

var server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


//socket io
var io = socketio(server);

var clients = {};
var client_id = 0;

io.on('connection', (socket) => {

  socket.on("disconnect", function() {
    if(this.user !== undefined){
      console.log(this.user.username + " was disconnected...") // prints: foobar
      delete clients[this.client_id];
    }
  });

  socket.on('emailCheck', (data) => {
    var headers = {'Content-Type':'application/json', 'Accept':'application/json'};
    var options = { method:'GET', headers:headers };

    request.get('http://localhost:8080/users/email/' + data.email + '/', options, function(error, response){
      socket.emit('emailCheckReply', response);
    });
  });

  socket.on('userNameCheck', (data) => {
    var headers = {'Content-Type':'application/json', 'Accept':'application/json'};

    var options = { method:'GET', headers:headers };

    request.get('http://localhost:8080/users/user_name/' + data.userName + '/', options, function(error, response){
      socket.emit('userNameCheckReply', response);
    });
  });

  socket.on('auth', (user) => {
    socket.client_id = client_id;
    socket.user = user;
    clients[client_id] = socket;
    client_id++;
    console.log("User = " + user.username + ", was authenticate.");
  });

  socket.on('room.join', (room) => {
    console.log(socket.rooms);
    socket.join(room);
    console.log("User joined " + room  + " room.");

    if(typeof io.sockets.adapter.rooms['lobby'] !== 'undefined'){
      var clients = io.sockets.adapter.rooms['lobby'].sockets;

      console.log("In Lobby Room:");

      for (var client in clients ) {
        console.log('Username: ' + JSON.stringify(client));
      }
    }
  });

  socket.on('room.leave', (room) => {
    console.log(socket.rooms);
    socket.leave(room);
    console.log("User left " + room  + " room.");

    if(typeof io.sockets.adapter.rooms['lobby'] !== 'undefined'){
      var clients = io.sockets.adapter.rooms['lobby'].sockets;

      console.log("In Lobby Room:");

      for (var client in clients ) {
        console.log('Username: ' + JSON.stringify(client));
      }
    }
  });

  socket.on('room.close', (gameRoom) => {
    socket.broadcast.to('lobby').emit('room.close', gameRoom);
  });

  socket.on('room.watcher', (data) => {
    socket.broadcast.to('lobby').emit('room.watcher', data);
  });

  socket.on('lobby.update', (parties) => {
    var headers = {'Content-Type':'application/json', 'Accept':'application/json'};
    var options;

    if(typeof parties.all !== 'undefined') options = { method:'GET', headers:headers, qs:{'all':'all', 'group':'none', 'user':'none'} };
    else if(typeof parties.group !== 'undefined') options = { method:'GET', headers:headers, qs:{'all':'none', 'group':parties.group, 'user':'none'} };
    else if(typeof parties.user !== 'undefined') options = { method:'GET', headers:headers, qs:{'all':'none', 'group':'none', 'user':parties.user} };
    else options = { method:'GET', headers:headers, qs:{'all':'none', 'group':'none', 'user':'none'} };

    request.get('http://localhost:8080/lobby/update/view', options, function(error, response){
      if(typeof error !== 'undefined' && error){
          console.log("Error as occured, error = " + error);
      }
      else{
        console.log(response.body)
        console.log(parties)

        if(parties.all !== undefined) io.sockets.emit('lobby.update.view', response.body);
        else if(parties.group !== undefined) {
          socket.emit('lobby.update.view', response.body);
          socket.broadcast.to(parties.group).emit('lobby.update.view', response.body);
        }
        else if(parties.user !== undefined){
          for(var key in clients){
            if(clients[key].user.username == parties.user){
              clients[key].emit('lobby.update.view', response.body);
              break;
            }
          }
        }
      }
    });
  });

});
