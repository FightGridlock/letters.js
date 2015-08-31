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
var User = require('../models/user');

var mailerDaemon = function(){
    
    var mailOptions = {};
    
    console.log("Checking for unsent emails...");
    Email.find({ sent: false }, function(err, emails) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Found " + emails.length + " unsent emails.\nChecking for verification...");
            // Run through array of email objects, send each one, then update the "sent" field
            emails.forEach(function(email) {
                
                User.findOne({ email: email.replyTo /* /FLAG/ change this to email.userId  */})
                .select('firstName lastName verified email')
                .exec(function(err, user) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        if(user.verified === 300) {
                            mailOptions = {
                                from: email.from, // REVIEW THIS - can use email.from?
                                to: email.to, // array
                                cc: email.cc, // array 
                                bcc: email.bcc, // array 
                                subject: email.subject, // Subject line
                                text: email.text,
//                              html: email.html, //not in use right now
                                'h:Reply-To': email.replyTo
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
                        }
                    }
                });
            });
        }
    });
};

module.exports = mailerDaemon;