// mailerDaemon.js file in /app/helpers/

var nodemailer = require("nodemailer");
var mg = require("nodemailer-mailgun-transport");
var async = require("async");

var settings = require("../settings");
var keyGenerator = require("../helpers/keyGenerator");

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

var verifyDaemon = function(){
    
    // Make sure all users have initialized 'verified' parameter, and initialize if not
    User.find( { verified: { $exists: false } }, function(err, users) {
        if (err) {
            console.log(err);
        }
        else {
            users.forEach(function(user){
                console.log("User Verification Uninitialized: " + user.email);
                user.verified = 100;
                user.save(function(err, user) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("User Verification Initialized: " + user.email);
                    }
                });
            });
        }
    });
    
    User.find({ verified: 100 }, function(err, users) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Found " + users.length + " unconfirmed emails.");
            users.forEach(function(user){
                var mailOptions = {
                    from: settings.admin.name + " <" + settings.emailService.emailUser + '@' + settings.emailService.domain + ">",
                    to: user.email,
                    subject: "Please Confirm your Email Address",
                    text:   "Hello " + user.firstName + " " + user.lastName + "\n" + 
                            "Thank you for joining the campaign to save the Hurontatio-Main LRT (HMLRT)\n\n" + 
                            "Because of a request by the City of Brampton's Clerk's Office, we now need to verify every email before we send it. We understand that you are a busy person, that's why this will only take a single click!\n\n" + 
                            "This is the secure link to verify your address: \n" +
                            process.env.SITEURL + "/api/confirm/" + user._id + "/" + user.authKey + "\n\n" +
                            "If you did not send your councillor a letter using http://onebrampton.com/contact/ please let us know of the unauthorized use of your email using this link:\n\n" +
                            process.env.SITEURL + "/api/fraud/" + user._id + "/" + user.authKey + "\n\n" +
                            "We will not send any message until your email is confirmed, and if you report fraudulent activity we will delete the email message outright. By confirming your email" + 
                            " you also confirm that your message will become part of the City of Brampton public record and may be read during the special council meeting on September 16, 2015 with all personal details, such as your email, erased.\n" +
                            "Thank you for your time, have a wonderful day\n\n" +
                            "One Brampton\n" +
                            "http://onebrampton.com/\n" +
                            "onebrampton@gmail.com",
                    html:   "<p>Hello " + user.firstName + " " + user.lastName + "" + 
                            "<p>Thank you for joining the campaign to save the Hurontatio-Main LRT (HMLRT)</p><br />" + 
                            "<p>Because of a request by the City of Brampton's Clerk's Office, we now need to verify every email before we send it. We understand that you are a busy person, that's why this will only take a single click!</p>" +
                            "<p>This is the secure link to verify your email address: <br />" +
                            "<a href=\'" + process.env.SITEURL + "/api/confirm/" + user._id + "/" + user.authKey + "\'>" + process.env.SITEURL + "/api/confirm/" + user._id + "/" + user.authKey + "</a></p><br />" +
                            "<p>If you did not send your councillor a letter using http://onebrampton.com/contact/ please let us know of the unauthorized use of your email using this link:<br />" +
                            "<a href=\'" + process.env.SITEURL + "/api/fraud/" + user._id + "/" + user.authKey + "\'>" + process.env.SITEURL + "/api/fraud/" + user._id + "/" + user.authKey + "</a></p><br />" +
                            "<p>We will not send any message until your email is confirmed, and if you report fraudulent activity we will delete the email message outright. By confirming your email" + 
                            "&nbsp;you also confirm that your message will become part of the City of Bramption public record and may be read during the special council meeting on <strong>September 16, 2015</strong> with all personal details such as your email erased.</p>" +
                            "<p>Thank you for your time, have a wonderful day</p>" +
                            "<p><strong>One Brampton</strong><br />" +
                            "<a href=\'http://onebrampton.com/\'>http://onebrampton.com/</a> <br />" +
                            "<a href=\'mailto:onebrampton@gmail.com\'>onebrampton@gmail.com</a>"
                };
                mailer.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        user.verified = 200;
                        user.save(function(err, user) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("Confirmation request sent to: " + user.email);
                            }
                        });
                        console.log("Info: " + info.response);
                    }
                });
            });
        }
    });
};

module.exports = verifyDaemon;