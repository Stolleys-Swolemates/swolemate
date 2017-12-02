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
    		"weight" : 0,
    		"height" : 0,
    		"sex" : null,
    		"stats" : {
          "bench" : 0,
          "overheadpress" : 0,
          "deadlift" : 0,
          "squats" : 0
        },
    		"workouts" : {},
    		"weights" : [],
    		"caloricCount" : {
          "actual" : 0,
          "goal" : 0
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
		if(users[req.params.userId] == 'undefined' ||
			users[req.params.userId] == null){
			res.status(404).send("ERROR 404: ID not found");
		}
		else{
			delete users[req.params.userId];
			res.end( "Deleted user with ID: " + req.params.userId);
		}
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
    
    //if statements to calc for male or female
    //Males equation: 66.4730 + (13.7516 x weight in kg) + (5.0033 x height in cm)
    //Females equation: 655.0955 + (9.5634 x weight in kg) + (1.8496 x height in cm)
    
    var cals = req.body.actual;
    var id = req.params.userId - 1;
    var goalCals = users[id].weight * users[id].height; 
    var actualCals = cals + users[id].caloricCount.actual;
    
    users[id].caloricCount.actual = actualCals;
    users[id].caloricCount.goal = goalCals;
    res.end();
    console.log(users[id]);
  })

app.route('/users/:userId/weights/')
  .post(function (req, res) {
    res.header("Content-Type", "application/json");
    res.status(200);
    
    var date = req.body.date;
    var weight = req.body.weight;
    var id = req.params.userId - 1;
    console.log(users[id].weights);
    users[id].weights.push({date, weight});
    res.end();
    console.log(users[id]);
  })

app.route('/users/:userId/stats/')
  .put(function (req, res) {
    res.header("Content-Type", "application/json");
    res.status(200);
    
    var bench = req.body.bench;
    var overheadpress = req.body.overheadpress;
    var deadlift = req.body.deadlift;
    var squats = req.body.squats;
    var id = req.params.userId - 1;
    
    users[id].stats.bench = bench;
    users[id].stats.overheadpress = overheadpress;
    users[id].stats.deadlift = deadlift;
    users[id].stats.squats = squats;
    res.end();
    
    console.log(users[id]);
  })
  
app.route('/users/:userId/workouts/:workoutId')
	.get(function(req, res){
		if(users[req.params.userId].workouts[req.params.workoutId] == 'undefined' ||
			users[req.params.userId].workouts[req.params.workoutId] == null){
			res.status(404).send("ERROR 404: ID not found");
		}
		else
			res.json(users[req.params.userId].workouts[req.params.workoutId]);
	})
	.delete(function(req, res){
		if(users[req.params.userId].workouts[req.params.workoutId] == 'undefined' ||
			users[req.params.userId].workouts[req.params.workoutId] == null){
			res.status(404).send("ERROR 404: ID not found");
		}
		else
			delete users[req.params.userId].workouts[req.params.workoutId];
			res.end( "Deleted workout with ID: " + req.params.workoutId + 
				" for user with ID: " + req.params.userId);
	})

app.route('/users/:userId/workouts/:workoutId/:exerciseName')
	.post(function(req, res){
		var workout = users[req.params.userId].workouts[req.params.workoutId];

		console.log(req.params.exerciseName);
		if(users[req.params.userId].workouts[req.params.workoutId] == 'undefined' ||
			users[req.params.userId].workouts[req.params.workoutId] == null){
			res.status(404).send("ERROR 404: ID not found");
		}
		else{
			workout[req.params.exerciseName] = req.body;
			res.json(users[req.params.userId].workouts[req.params.workoutId]);
		}

	})
	.get(function(req, res){

	})
	.delete(function(req, res){

	})

//-----------------------------------------------------------------------
var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("SWOLEMATE listening at http://%s:%s", host, port);

});