// server.js - letters

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var schedule = require("node-schedule");

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
app.enable('trust proxy');

// set port
var port = process.env.PORT || 3000;

// configure routes
var api         = require("./app/routes/api");
var router      = require("./app/routes/index");
var email       = require("./app/routes/email");
var send        = require("./app/routes/send");
var user        = require("./app/routes/user");
var ward        = require("./app/routes/ward");
var rep         = require("./app/routes/rep");
var template    = require("./app/routes/template");
var confirm     = require("./app/routes/confirm");
var fraud       = require("./app/routes/fraud");

app.use("/api/send", send);
app.use("/api/emails", email);
app.use("/api/users", user);
app.use("/api/wards", ward);
app.use("/api/reps", rep);
app.use("/api/templates", template);
app.use("/api/confirm", confirm);
app.use("/api/fraud", fraud);

app.use("/api", api);
app.use("/", router);

// Helper Modules
var subManager      = require("./app/helpers/subManager");
var verifyDaemon    = require("./app/helpers/verifyDaemon");
var mailerDaemon    = require("./app/helpers/mailerDaemon");
var subFixer        = require("./app/helpers/subFixer");

//Scheduled Tasks
var helperSm = schedule.scheduleJob( '* 5 * * *', subManager);
var helperSf = schedule.scheduleJob( '* 6,12,18 * * *', subFixer); 
var helperVd = schedule.scheduleJob( '0,15,30,45 * * * *', verifyDaemon); // Every 15 minutes starting on the hour
var helperMd = schedule.scheduleJob( '*/5 * * * *', mailerDaemon); // Every 5 minutes



// Email Service
/* Removed in favour of node-scheduler cron style stasks
var minutes = settings.emailService.interval,
    runtime = minutes * 60 * 1000;
setInterval(mailerDaemon, runtime);
*/

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('==== ' + Date.now() + ' ====\n' + 'Letters App running on Port ' + port);