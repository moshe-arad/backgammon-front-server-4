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
        if(typeof error !== 'undefined' && error){
            console.log("Error as occured, error = " + error);
        }
        else{
            if(typeof body !== 'undefined' && body){
                if(JSON.parse(body).isUserFound == true){
                    console.log("User found...");
                    res.json(JSON.parse(body).backgammonUser)
                    res.status(200);
                    res.end();
                }
                else if(JSON.parse(body).isUserFound == false){
                    console.log("User not found...");
                    res.status(401);
                    res.end();
                }
            }
            else {
                console.log("Error occured reading body, while trying to authenticate user...");
            }
        }
    });
});

router.post('/logout', (req, res) => {
  var headers = {
      'Content-Type':'application/json'
  }

  var options = {
      method:'PUT',
      headers:headers,
      body:JSON.stringify({"username":req.body.username, "password":req.body.password})
  }

  request.put('http://localhost:8080/users/logout', options, (error, response, body) => {
    if(typeof error !== 'undefined' && error){
      console.log("Error as occured, error = " + error);
    }
    else{
      if(typeof body !== 'undefined' && body){
        if(JSON.parse(body).isUserFound == true){
          console.log("User found, and logged out...");
          res.status(200);
          res.end();
        }
        else if(JSON.parse(body).isUserFound == false){
          console.log("User not found, did not logged out...");
          res.status(500);
          res.end();
        }
      }
      else {
        console.log("Error occured reading body, while trying to authenticate user...");
      }
    }
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
