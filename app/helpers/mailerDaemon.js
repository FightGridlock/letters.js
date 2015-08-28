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
    
    console.log('Checking for unconfirmed emails...')
    Email.find({ confirmed: 100}, function(err, emails) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Found " + emails.length + " unconfirmed emails.");
            emails.forEach(function(email){
                User.findById(email.userId, function(err, user){
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var mailOptions = {
                            from: settings.emailService.emailUser + '@' + settings.emailService.domain,
                            to: email.replyTo,
                            subject: "Please Confirm your Email Address",
                            text:   "Hello " + user.firstName + " " + user.lastName + "\n" + 
                                    "Thank you for joining the campaign to save the Hurontatio-Main LRT (HMLRT)\n\n" + 
                                    "Please confirm your email so that we may send your letter to your councillors using this link: \n" +
                                    process.env.SITEURL + "/api/confirm/" + email._id + "/" + user.authKey + "\n\n" +
                                    "If you did not send your councillor a letter using http://onebrampton.com/contact/ please let us know of the unauthorized use of your email using this link:\n\n" +
                                    process.env.SITEURL + "/api/fraud/" + email._id + "/" + user.authKey + "\n\n" +
                                    "We will not send any message until your email is confirmed, and if you report fraudulent activity we will delete the email message outright. By confirming your email" + 
                                    " you also confirm that your message will become part of the City of Bramption public record and may be read during the special council meeting on September 16, 2015 with all personal details such as your email erased.\n" +
                                    "Thank you for your time, have a wonderful day\n\n" +
                                    "One Brampton\n" +
                                    "http://onebrampton.com/\n",
                            html:   "<p>Hello " + user.firstName + " " + user.lastName + "" + 
                                    "<p>Thank you for joining the campaign to save the Hurontatio-Main LRT (HMLRT)</p><br />" + 
                                    "<p>Please confirm your email so that we may send your letter to your councillors using this link: </p>" +
                                    "<p><a href=\'" + process.env.SITEURL + "/api/confirm/" + email._id + "/" + user.authKey + "\'>" + process.env.SITEURL + "/api/confirm/" + email._id + "/" + user.authKey + "</a></p><br />" +
                                    "If you did not send your councillor a letter using http://onebrampton.com/contact/ please let us know of the unauthorized use of your email using this link:\n\n" +
                                    "<p><a href=\'" + process.env.SITEURL + "/api/fraud/" + email._id + "/" + user.authKey + "\'>" + process.env.SITEURL + "/api/fraud/" + email._id + "/" + user.authKey + "</a></p><br />" +
                                    "<p>We will not send any message until your email is confirmed, and if you report fraudulent activity we will delete the email message outright. By confirming your email" + 
                                    "&nbsp;you also confirm that your message will become part of the City of Bramption public record and may be read during the special council meeting on September 16, 2015 with all personal details such as your email erased.</p>" +
                                    "<p>Thank you for your time, have a wonderful day</p>" +
                                    "<p>One Brampton<br />" +
                                    "<a href=\'http://onebrampton.com/\'>http://onebrampton.com/</a></p>"
                        };
                        mailer.sendMail(mailOptions, function(err, info) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                email.confirmed = 200;
                                email.save(function(err, email) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log("Confirmation request sent to: " + email.replyTo);
                                    }
                                });
                                console.log("Info: " + info.response);
                            }
                        });
                    }
                });
            });
        }
    });
    
    console.log("Checking for unsent emails...");
    Email.find({ sent: false, confirmed: 300 }, function(err, emails) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Found " + emails.length + " unsent emails.");
            // Run through array of email objects, send each one, then update the "sent" field
            emails.forEach(function(email) {
                var mailOptions = {
                    from: settings.emailService.emailUser + '@' + settings.emailService.domain, // REVIEW THIS - can use email.from?
                    to: email.to, // array of receivers
                    cc: email.cc,
                    bcc: email.bcc, // array of bcc reciever
                    subject: email.subject, // Subject line
                    text: email.text,
//                  html: email.html, //not in use right now
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