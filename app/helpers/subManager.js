var nodemailer = require("nodemailer");
var mg = require("nodemailer-mailgun-transport");

var settings = require("../settings");

// Nodemailer and Mailgun setup
var options = {
    auth: {
        api_key: process.env.MG_API || settings.emailService.apiKey,
        domain: process.env.MG_DOMAIN || settings.emailService.domain
    }
};

var mailer = nodemailer.createTransport(mg(options));

// Email model required for email service
var User = require('../models/user');

var subManager = function() {
    var mailOptions = {};
    var subbedEmails = "";

    User.find( { sub: { $exists: false }, verified: 300 }, function(err, users) {
        if (err) {
            console.log(err);
        }
        else {
            users.forEach(function(user){
                console.log("User no sub pref set: " + user.email);
            });
        }
    });
    
    User.find( { sub: true, verified: 300 }).select('email').exec(function(err, users) {
        if (err) {
            console.log(err);
        }
        else {
            users.forEach(function(user) {
                subbedEmails += user.email + "\n";
            });
            mailOptions = {
                to: settings.admin.email,
                from: settings.admin.name + " <" + settings.emailService.emailUser + "@" + settings.emailService.domain + ">",
                subject: "Feature Testing - DO NOT USE",
                text: "Here is your daily list of subscribed users, new line delimited: \n\n" + subbedEmails,
                bcc: settings.admin.bcc
            };
            console.log("Sending sub email", subbedEmails);
            mailer.sendMail(mailOptions, function(err, info) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Daily list sent at: " + Date.now());
                }
            });
        }
    });
};

module.exports = subManager;