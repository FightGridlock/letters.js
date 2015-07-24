// server.js | letters

var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var nodemailer = require("nodemailer");
var mg = require("nodemailer-mailgun-transport");

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

// Nodemailer and Mailgun setup
var options = {
    auth: {
        api_key: process.env.MG_API || settings.emailService.apiKey,
        domain: process.env.MG_DOMAIN || settings.emailService.domain
    }
};

var mailer = nodemailer.createTransport(mg(options));

// Email model required for email service
var Email = require('./app/models/email');

// Email Service
var minutes = settings.emailService.interval,
    runtime = minutes * 60 * 1000;
setInterval(function() {
    console.log("Checking for unsent emails...");
    Email.find({
        sent: false
    }, function(err, emails) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Found " + emails.length + " emails.");
            // Run through array of email objects, send each one, then update the "sent" field
            emails.forEach(function(email) {
                var mailOptions = {
                    from: 'noreply@fightgridlock.anxgroup.com',
                    to: email.to, // array of receivers
                    bcc: email.bcc, // array of bcc reciever
                    subject: email.subject, // Subject line
                    text: email.body, // plaintext body
                    'h:Reply-To': email.from
                };
                mailer.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        email.sent = true;
                        email.save(function(err, email) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("Sent Email: " + email._id);
                            }
                        });
                        console.log("Info: " + info.response);
                    }
                });
            });
        }
    });
}, runtime);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);