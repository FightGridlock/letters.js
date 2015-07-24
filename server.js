// server.js - letters

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Settings file
var settings = require("./app/settings")

// Development Bool for Debug logs and DB is: settings.devel

var mongoURI;

if (settings.devel) {
    mongoURI = settings.mongoURI.development;
}
else {
    mongoURI = settings.mongoURI.production;
}

mongoose.connect(mongoURI); // connect to our database


// BodyParser lets us get data from POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// set port
var port = process.env.PORT || 3000;

// configure routes
var api     = require("./app/routes/api");
var router  = require("./app/routes/index");
var email   = require("./app/routes/email");
var send    = require("./app/routes/send");
var user    = require("./app/routes/user");
var ward    = require("./app/routes/ward");
var rep     = require("./app/routes/rep");

app.use("/api/send", send);
app.use("/api/emails", email);
app.use("/api/users", user);
app.use("/api/wards", ward);
app.use("/api/reps", rep);

app.use("/api", api);
app.use("/", router);

// Mailer Daemon
var mailerDaemon = require("./app/helpers/mailerDaemon");

// Email Service
var minutes = settings.emailService.interval,
    runtime = minutes * 60 * 1000;
setInterval(mailerDaemon, runtime);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);