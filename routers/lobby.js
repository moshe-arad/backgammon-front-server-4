var express = require('express');
var request = require('request');
var router = express.Router();
module.exports = router;

router.post('/lobby/room', (req, res) => {
  console.log("Will try to open a new game room...")

  var headers = {'Content-Type':'application/json', 'Accept:application/json'};

  var options = {
    method:'POST',
    headers:headers,
    body:JSON.stringify(req.body)
  };

  request.post("http://localhost:8080/lobby/room", options, (error, response, body) => {
    res.end();
  });
});
