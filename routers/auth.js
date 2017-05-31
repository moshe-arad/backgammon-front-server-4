var express = require('express');
var request = require('request');
var router = express.Router();
module.exports = router;

router.post('/login', (req, res) => {
    var headers = {
        'Content-Type':'application/json'
    }

    var options = {
        method:'PUT',
        headers:headers,
        body:JSON.stringify({"username":req.body.username, "password":req.body.password})
    }

    request.put('http://localhost:8080/users/login', options, (error, response, body) => {
      if(typeof error !== 'undefined' && error) console.log("Error as occured, error = " + error);
      else res.status(response.statusCode).end();
    });
});

router.post('/logout', (req, res) => {
  var headers = { 'Content-Type':'application/json' }

  var options = {
      method:'PUT',
      headers:headers,
      body:JSON.stringify({"username":req.body.username, "password":req.body.password})
  }

  request.put('http://localhost:8080/users/logout', options, (error, response, body) => {
    if(typeof error !== 'undefined' && error) console.log("Error as occured, error = " + error);
    else res.status(response.statusCode).end();
  });
});

//create new user
router.post('/users/', function(req, res){
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
      if(response.statusCode == 201) console.log("User created successfuly...");
      res.status(response.statusCode).json(response.body);
    }
  });
});
