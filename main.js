require('colors');
import { DQNSolver, DQNOpt, DQNEnv } from 'reinforce-js';
var http = require("http");
var tjs = require('teslajs');
 
 //login to your tesla here, awesome oauth2
    var username = "";
    var password = "";

//for americans 
function ctof(degc) {
    return Math.round(degc * 9 / 5 + 32);
}

//lets gooo
function trainingLoop(interior_temp, exterior_temp) {
	const width = 400;
	const height = 400;
	const numberOfStates = 200;
	const numberOfActions = 800;
	const env = new DQNEnv(width, height, numberOfStates, numberOfActions);
	const opt = new DQNOpt();
	opt.setTrainingMode(true);
	opt.setNumberOfHiddenUnits([100]);  // mind the array here, currently only one layer supported! Preparation for DNN in progress...
	opt.setEpsilonDecay(1.0, 0.1, 1e6);
	opt.setEpsilon(0.05);
	opt.setGamma(0.9);
	opt.setAlpha(0.005);
	opt.setLossClipping(true);
	opt.setLossClamp(1.0);
	opt.setRewardClipping(true);
	opt.setRewardClamp(1.0);
	opt.setExperienceSize(1e6);
	opt.setReplayInterval(5);
	opt.setReplaySteps(5);
	const dqnSolver = new DQNSolver(env, opt);
	const state = [ /* Array with numerical values and length of 20 as configured via numberOfStates */ ];
setInterval(function(){ // start the learning loop
  // s is an array of length 8
  //... execute action in environment and get the reward
  // the agent improves its Q,policy,model, etc. reward is a float
  var action = dqnSolver.decide(state);

console.log('yo' + action);
//if action (internal temp +1 or +1 closer to external + 1)
var last_action;
var reward;
if(action-last_action > 0) {
  reward = interior_temp;
}
else 
{
  reward = exterior_temp;
}
/*
Now calculate some Reward and let the Solver learn from it, e.g.:
*/


dqnSolver.learn(reward);
}, 0);



}


http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});

       tjs.login(username, password, function(err, result) {
        if (result.error) {
          console.log(JSON.stringify(result.error));
          process.exit(1);
        }
 
        var token = JSON.stringify(result.authToken);
 
 	    //step 1 - authenticate
        if (token)
            console.log("Login Succesful!");

      
            var options = { authToken: result.authToken };
            //step 2 - Get Vehicle Object
    		tjs.vehicle(options, function (err, vehicle) {
        		console.log("Vehicle " + vehicle.vin + " is: " + vehicle.state);
        		var options2 = { authToken: result.authToken, vehicleID: vehicle.id_s };
   				 //step 3 - Get Charge State
   				 tjs.chargeState(options2, function (err, chargeState) {
        			console.log("Current charge level: " + chargeState.battery_level + '%');
        			  //step 4 - Get Climate values (inside temp, outside temp)
        			  tjs.climateState(options2, function (err, climate_state) {
        				var str = climate_state.is_auto_conditioning_on ? "ON".red : "OFF".green;
        				console.log("\nClimate is currently: " + str);

        				if (climate_state.fan_status) {
            				console.log("Fan Speed: " + climate_state.fan_status.toString().green);
        				}
        				var interior_temp = ctof(climate_state.inside_temp).toString();
        				var exterior_temp = ctof(climate_state.outside_temp).toString();

        				if (climate_state.inside_temp && climate_state.inside_temp !== 0) {
            				console.log("\nInterior: " + ctof(climate_state.inside_temp).toString().green + " Deg.F");
        				}

        				if (climate_state.outside_temp && climate_state.outside_temp !== 0) {
            				console.log("Exterior: " + ctof(climate_state.outside_temp).toString().green + " Deg.F");
        				}	
        				//Step 5 Send 2 temperatures, 1 charge level every second to RL servers
        				//Step 6 RL Agent acts(+1/ -1 temp, 1 charge level), reward (charge level same/diff) Optimize
        				//Step 7 Set Temperature automatically to maximize charge but also keep car hot 
             			trainingLoop(interior_temp, exterior_temp);

    });

});


    		});

    		
    });
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');
