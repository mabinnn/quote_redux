//express
var express = require('express');
var app = express();

//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/redux_quotes');

//schema settings
var QuoteSchema = new mongoose.Schema({
  name: String,
  quotes: String
}, {timestamps: true} );
mongoose.model('Redux', QuoteSchema);
var Redux = mongoose.model('Redux')
mongoose.Promise = global.Promise;


//path
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Begin routes
app.get('/', function(request, response){
  response.render('index')
});


app.get('/quotes', function(request, response){
  console.log('entered quotes page');

  // show all quotes in the redux dbs
  Redux.find({}, function(err, results){
    if(err){
      console.log("Unable to quoety database");
    } else {
      console.log("successfully found records! Rendering now....")
      response.render('quotes', {"quotes": results});
    }
  });
});




app.post('/submit', function(request, response){
  console.log('User submitted: ', request.body)


  var redux = new Redux({
    name: request.body.name,
    quotes: request.body.quotes,
  });

  redux.save(function(err){
    if(err){
      console.log("Unable to SAVE new user and quotes!");
    } else {
      console.log("Successfully added NEW user and quotes!")
      console.log(redux)
      response.redirect('/quotes')
    }
  });
});


app.listen(8001, function(){
  console.log("Now listening to port 8001");
});
