var express = require("express");
var app = express();
var request = require('request');
var socketio = require('socket.io');
var bodyParser = require('body-parser')

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render("index.html");
});

app.get('/authenticateUser', function(req, res){
  console.log("Trying to authenticate user...");

  var headers = {
      'authorization':req.headers.authorization
  }

  var options = {
      headers:headers
  }

  request.get('http://localhost:8080/authenticateUser', options, (error, response, body) => {
    if(typeof error !== 'undefined' && error){
      console.log("Error as occured, error = " + error);
    }
    else{
      if(typeof body !== 'undefined' && body){
        var reply = {'name':JSON.parse(body).principal.userName};
        console.log("User = " + reply.name + ", Logged in successfuly...");
        res.set('Content-Length', Buffer.byteLength(JSON.stringify(reply)));
        res.status(response.statusCode);
        res.json(reply);
      }
      else {
        console.log("Error occured reading body, while trying to authenticate user...");
        res.writeHead(500);
      }
      res.end();
    }
  });
});

app.post('/logout', function(req, res){
  console.log("Will send logout request...");
  request.post('http://localhost:8080/logout', (error, response, body) => {
    if(typeof error !== 'undefined' && error){
      console.log("Error as occured, error = " + error);
    }
    else{
      if(response.statusCode == 200) console.log("User logged out successfuly...");
      res.body = body;
      res.writeHead(response.statusCode, {'Content-Length': Buffer.byteLength(body), 'Content-Type': 'application/json' });
      res.end();
    }
  });
});

app.post('/users/', function(req, res){
  console.log("Will create new user...");
  // Set the headers
  var headers = {
      'Content-Type':'application/json'
  }

  // Configure the request
  var options = {
      method:'POST',
      headers:headers,
      body:JSON.stringify(req.body)
  }

  request.post('http://localhost:8080/users/', options, (error, response, body) => {
    if(typeof error !== 'undefined' && error){
      console.log("Error as occured, error = " + error);
    }
    else{
      if(response.statusCode == 200) console.log("User created successfuly...");
      res.writeHead(response.statusCode);
      res.end();
    }
  });
});

var server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

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
