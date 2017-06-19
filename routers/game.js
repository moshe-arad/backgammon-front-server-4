var express = require('express');
var request = require('request');
var router = express.Router();
module.exports = router;

router.post('/game/rollDice', (req, res) => {
  var headers = {'Content-Type':'application/json', 'Accept':'application/json'};

  var options = {
    method:'POST',
    headers:headers,
    body:JSON.stringify({'username':req.body.username, 'gameRoomName':req.body.gameRoomName})
  };

  request.post("http://localhost:8080/game/rollDice", options, (error, response, body) => {
    if(typeof error !== 'undefined' && error){
        console.log("Error as occured, error = " + error);
    }
    else res.status(response.statusCode).json(response.body);
    res.end();
  });
});

router.post('/game/move', (req, res) => {
  var headers = {'Content-Type':'application/json', 'Accept':'application/json'};

  var options = {
    method:'POST',
    headers:headers,
    body:JSON.stringify({'username':req.body.username, 'gameRoomName':req.body.gameRoomName, 'from':req.body.from, 'to':req.body.to})
  };

  request.post("http://localhost:8080/game/move", options, (error, response, body) => {
    if(typeof error !== 'undefined' && error){
        console.log("Error as occured, error = " + error);
    }
    else res.status(response.statusCode).json(response.body);
    res.end();
  });
});
