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

var server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


//socket io
var io = socketio(server);

io.on('connection', (socket) => {
  socket.on('emailCheck', (data) => {
    request.get('http://localhost:8080/users/email/' + data.email + '/', function(error, response){
      socket.emit('emailCheckReply', response);
    });
  });

  socket.on('userNameCheck', (data) => {
    request.get('http://localhost:8080/users/user_name/' + data.userName + '/', function(error, response){
      socket.emit('userNameCheckReply', response);
    });
  });
});
