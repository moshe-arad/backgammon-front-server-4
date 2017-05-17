var express = require('express');
var request = require('request');
var router = express.Router();
module.exports = router;

router.post('/lobby/room', (req, res) => {
  console.log("Will try to open a new game room...")

  var headers = {'Content-Type':'application/json', 'Accept':'application/json'};

  var options = {
    method:'POST',
    headers:headers,
    body:JSON.stringify({'username':req.body.username})
  };

  request.post("http://localhost:8080/lobby/room", options, (error, response, body) => {
    if(typeof error !== 'undefined' && error){
        console.log("Error as occured, error = " + error);
    }
    else{
      if(response.statusCode == 201) console.log("New Game room created successfuly...");
      else if(response.statusCode == 200) console.log("Game room was not created...");

      res.status(response.statusCode).json(response.body);
    }
    res.end();
  });
});

router.delete('/lobby/room/close', (req, res) => {
  console.log("Will try to close game room...")

  var headers = {'Content-Type':'application/json', 'Accept':'application/json'};
  var options = {
    method:'DELETE',
    headers:headers,
    body:JSON.stringify({'username':req.body.username})
  };

  request.delete("http://localhost:8080/lobby/room/close", options, (error, response, body) => {
    if(typeof error !== 'undefined' && error){
        console.log("Error as occured, error = " + error);
    }
    else{
      if(response.statusCode == 200){
        console.log("Game Room delete response accepted successfuly...")
        console.log(JSON.stringify(response.body))

        console.log("Response passed to front...")
        res.status(response.statusCode).json(response.body);
      }
    }
    res.end();
  });
});
