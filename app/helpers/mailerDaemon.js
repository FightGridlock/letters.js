// mailerDaemon.js file in /app/helpers/

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
var Email = require('../models/email');

var mailerDaemon = function(){
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
};

module.exports = mailerDaemon;