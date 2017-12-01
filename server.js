var express = require('express');
var app = express();
var fs = require("fs");
var parser = require("body-parser");
var path = require('path');

var userIdCtr = 0;
var workoutIdCtr = 0;
var users = {};

app.use(express.static(path.join(__dirname, 'public')));
app.use(parser.json());
app.use(parser.urlencoded({ 
   extended: true 
}));

app.route('/users')
	.post(function (req, res) {
  		var newUser = {
    		"name" : "",
    		"weight" : null,
    		"height" : null,
    		"sex" : null,
    		"stats" : {
          "bench" : null,
          "overheadpress" : null,
          "deadlift" : null,
          "squats" : null
        },
    		"workouts" : {},
    		"weights" : {},
    		"caloricCount" : {
          "actual" : null,
          "goal" : null
        }
   		};

		newUser["name"] = req.body.name;
		newUser["weight"] = req.body.weight;
		newUser["height"] = req.body.height;
		newUser["sex"] = req.body.sex;

		users[userIdCtr] = newUser;

		console.log("New user created. User ID: " + 
		userIdCtr + "\n" + users[userIdCtr]);
  
		res.end();

		if (res.statusCode = 200){
 			console.log("200 OK");
  		}
  		else
    		console.log("404 NOT FOUND");
  		
  		userIdCtr++;
  	})
  	.get(function (req, res){
  		res.json(users);
  	})

app.route('/users/:userId')
	.get(function (req, res){
		if(users[req.params.userId] === 'undefined' || users[req.params.userId] === null){
			res.status(404).send("ERROR 404: ID not found");
			console.log("User with specified ID does not exist");
		}
		else{
			console.log("Now displaying user with ID: " + req.params.userId + "\n" +
			users[req.params.userId]);
			res.json(users[req.params.userId]);
		}
	})
	.delete(function (req, res){
		delete users[req.params.userId];
		res.end( "Deleted user with ID: " + JSON.stringify(req.params.userId));
	})

app.route('/users/:userId/workouts')
	.post(function (req, res){
		var newWorkout = {};

		newWorkout = req.body;

		users[req.params.userId].workouts[workoutIdCtr] = newWorkout;

		res.end();
		workoutIdCtr++;
	})
	.get(function (req, res){
		if(users[req.params.userId].workouts == 'undefined' || 
			users[req.params.userId].workouts == null){
			res.status(404).send("ERROR 404: ID not found");
		}
		else{
			res.json(users[req.params.userId].workouts);
			console.log(users[req.params.userId].workouts);
		}
	})
	.delete(function (req, res){
		users[req.params.userId].workouts = {};
		console.log(users[req.params.userId].workouts);
		res.end();
	})
  
app.route('/users/:userId/caloricCount/')
  .put(function (req, res) {
    res.header("Content-Type", "application/json");
    res.status(200);
    
    var cals = req.body.actual;
    var id = req.params.userId - 1;
    console.log(users[id].caloricCount);
    users[id].caloricCount.actual.push({ cals });

    var goalCals = req.body.weight * req.body.height; 
    users[id].caloricCount.goal.push({ goalCals });
    
    res.end();
  })

app.route('/users/:userId/weights/')
  .post(function (req, res) {
    res.header("Content-Type", "application/json");
    res.status(200);
    
    var date = req.body.weights.date;
    var weight = req.body.weights.weight;
    var id = req.params.userId;
    
    Users.user[id].weights.push({ date , weight});
    res.end();
  })

app.route('/users/:userId/stats/')
  .put(function (req, res) {
    res.header("Content-Type", "application/json");
    res.status(200);
    
    var max = req.body.user.maxes;
    var id = req.params.id;
    
    Users.user[id].maxes.push({ max });
    res.end();
  })

//-----------------------------------------------------------------------
var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("REMINDER APP listening at http://%s:%s", host, port);

});