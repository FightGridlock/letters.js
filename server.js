// server.js | letters

var express     = require("express");
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var devel = true; // Development Bool for Debug logs and DB

var mongoURI;

if (devel)
{
    mongoURI = "mongodb://writer:BramptonWriter@ds060977.mongolab.com:60977/letters"
} else {
    mongoURI = "productionURI goes here"
}

mongoose.connect(mongoURI); // connect to our database

// BodyParser lets us get data from POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

// set port
var port = process.env.PORT || 3000;

// configure routes
var api = require("./app/routes/api");
var router = require("./app/routes/index");
var emails = require("./app/routes/email");

app.use("/api/emails", emails);
app.use("/api", api);
app.use("/", router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);