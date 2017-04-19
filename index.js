
/**
    Purpose : 1.To perform an oauth2 connection
	          2.Refresh the token after token expires
	Input   : 1.clientId(Obtained during the app config)
	          2.clientSecret(Obtained during the app config)
			  3.username
			  4.password
			  5.redirectUri
**/


// For providing the callback URL,we need http,express packages
var http = require('http');
var express = require('express')
var app = express();

// Declare a inputsFromDb
var inputsFromDb={};



// Include the jsforce package 
var jsforce = require('jsforce');

// specify the folder for views
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


/** Insert all the static inputs
    in MongoDb
 **/
 // Include all the packages required for MongoDb
 var mongoose = require('mongoose');
 mongoose.connect('mongodb://loginapp:loginapp@ds139360.mlab.com:39360/appsbrew');
 var db = mongoose.connection;
 
 // If there is an error in the connection,console the same
 db.on('error', console.error.bind(console, 'connection error:'));
 
 // Once the connection is established
 db.once('open', function() {
   // Create a schema for inputs
   var inputsSchema = mongoose.Schema({
                      loginUrl     : String,
                      clientId     : String,
                      clientSecret : String,
                      redirectUri  : String,
                      userName     : String,
                      password     : String

  });
  
  var inputs = mongoose.model('inputs', inputsSchema);
  
  // Insert the static inputs
  var input = new inputs({
                  loginUrl    :"https://login.salesforce.com",
                  clientId    : "3MVG9i1HRpGLXp.qcWt66xy9NSrYTCLAWuaU_j7GB3OFojtuRHgTYTJ9Bscp6_DcLMf.juDnBCl.AgP4_FSFp",
                  clientSecret: "8982420411326217823",
                  redirectUri : 'https://localhost:8000/connection',
                  userName    : 'mani@appsbrew.com',
                  password    : 'Welcome123'
				  
   });

   //Saving the model instance to the DB
   input.save(function(err){
    if ( err ) throw err;
  
    // Once the input is saved
    // get the user mani@appsbrew.com
    inputs.findOne({ userName: 'mani@appsbrew.com' }, function(err, row) {
                                                     if (err) throw err;
                                                     // Assign the query result to inputsFromDb
													 inputsFromDb = row;
                                                     console.log(inputsFromDb);
    });
  });
});

// Connection
app.get('/connection', function (req, res)
{
    res.render('connection.html');
});

app.get('/callback', function (req, res)
{
    res.render('callback.html');
});



// Create a http server and listen to port-3000
http.createServer(app).listen(8000, "0.0.0.0", function(){
  console.log('Express server listening on port ' + 8000);
});





