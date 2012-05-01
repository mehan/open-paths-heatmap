var express = require('express');
var ejs = require('ejs'); 
var app = express.createServer(express.logger());
//var mongoose = require('mongoose'); 
//var schema = mongoose.Schema;
var requestURL = require('request');

var util= require('util');
var OAuth = require('oauth').OAuth; //https://github.com/ciaranj/node-oauth
var moment = require('moment');


//server config

app.configure(function() {


  app.set('view engine', 'ejs'); // use the EJS node module
  app.set('views', __dirname + '/views'); // use /views as template directory
  app.set('view options', {
    layout: true
  }); // use /views/layout.html to manage your main header/footer wrapping template
  app.register('html', require('ejs')); //use .html files in /views

  app.use(express.static(__dirname + '/static'));

  //parse any http form post
  app.use(express.bodyParser());

  /**** Turn on some debugging tools ****/
  app.use(express.logger());
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));

});

//end server config



// Open Paths OAuth 2.0


var url = 'https://openpaths.cc/api/1';

//

app.get('/', function(request, response) {
    
    response.render("form.html");
});

app.get('/help', function(request, response) {
    
    response.render("help.html");
});

app.get('/about', function(request, response) {
    
    response.render("about.html");
});

app.post('/', function(request, response){
    console.log("Inside app.post('/')");
    console.log("form received and includes");
    console.log(request.body);
 
    
    // Simple data object to hold the form data
    var userData = {
        consumerKey : request.body.line1,
        consumerSecret : request.body.line2
    };
        
    
    response.redirect('/map' + userData);
    
});





// Open Paths OAuth 2.0

app.get("/map", function(request, response){

var CONSUMER_KEY = request.query.line1;
var CONSUMER_SECRET = request.query.line2;

    
    var oa= new OAuth(url,
                      url,
                      CONSUMER_KEY,
                      CONSUMER_SECRET,
                      "1.0",
                      null,
                      "HMAC-SHA1")

    signedURL = oa.signUrl('https://openpaths.cc/api/1');
    console.log("******************");
    console.log(signedURL);
    
    requestURL(signedURL, function(err, HTTPbody, data){
        
        //convert incoming data json string into native js object
        openPathData = JSON.parse(data);
        
        //loop through and create human readable dates
        for(i=0; i<openPathData.length; i++){
            currentPath = openPathData[i];
            
            // create tmpDate object, must multiple OpenPath timestamp by 1000
            // more moment formatting here http://momentjs.com/docs/#/displaying/format/
            tmpDate = moment(currentPath.t*1000); 
            currentPath.humanDate = tmpDate.format("dddd, MMMM Do YYYY, h:mm:ss a");
            
        }
        
     if (err) {
            console.log(err);
            response.redirect("error.html");
        }    
       
       
       else {
        
            
            
       //send data to JavaScript as JSON     
            
            templateData = {
            
            OPdataJSON : JSON.stringify(openPathData)
            
            }
            
        response.render("map.html",templateData);
    
           }
        
    })
})

app.get("/json", function(request, response){

//echo out the json
response.json(openPathData);

})


// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});