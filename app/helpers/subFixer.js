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

var subFixer = function() {
    var mailOptions = {};

    User.find({ sub: null, verified: 300 }, function(err, users) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(users.length + " users need sub fixing...")
            users.forEach(function(user){
                mailOptions = {
                    from: settings.admin.name + " <" + settings.emailService.emailUser + '@' + settings.emailService.domain + ">",
                    to: user.email,
                    subject: "Can We Keep You Up To Date?",
                    text:   "Hello " + user.firstName + " " + user.lastName + "\n" + 
                            "Thank you for joining the campaign to save the Hurontatio-Main LRT (HMLRT)\n\n" + 
                            "When you signed up, you did not set your communication preferences. By law, we cannot send you updates and newsletters unless you give us permission, so please use the following links to subscribe or unsubscribe at any time:\n\n" + 
                            "Subscribe: " +
                            process.env.SITEURL + "/api/users/" + user.email + "/subscribe" + "\n\n" +
                            "Unsubscribe: " +
                            process.env.SITEURL + "/api/users/" + user.email + "/unsubscribe" + "\n\n" +
                            "We will not send any further communications until you explicitly tell us your communication preference. We will never send spam and you can subscribe or unsubscribe at any time using the links in this email. See the privacy policy on our website for details on what we do with your personal information.\n\n" + 
                            "Thank you for your time, have a wonderful day\n\n" +
                            "One Brampton\n" +
                            "http://onebrampton.com/\n" +
                            "onebrampton@gmail.com",
                    html:   "<p>Hello " + user.firstName + " " + user.lastName + "" + 
                            "<p>Thank you for joining the campaign to save the Hurontatio-Main LRT (HMLRT)</p>" + 
                            "<p>When you signed up, you did not set your communication preferences. By law, we cannot send you updates and newsletters unless you give us permission, so please use the following links to subscribe or unsubscribe at any time:</p>" +
                            "<p>Subscribe:&nbsp;" +
                            "<a href=\'" + process.env.SITEURL + "/api/users/" + user.email + "/subscribe\'>" + process.env.SITEURL + "/api/users/" + user.email + "/subscribe</a></p>" +
                            "<p>Unsubscribe:&nbsp;" +
                            "<a href=\'" + process.env.SITEURL + "/api/users/" + user.email + "/unsubscribe\'>" + process.env.SITEURL + "/api/users/" + user.email + "/unsubscribe</a></p>" +
                            "<p>We will not send any further communications until you explicitly tell us your communication preference. We will never send spam and you can subscribe or unsubscribe at any time using the links in this email. See the privacy policy on our website for details on what we do with your personal information.</p>" + 
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
                        user.sub = false;
                        user.save(function(err, user) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("Subscription request sent to: " + user.email);
                            }
                        });
                        console.log("Info: " + info.response);
                    }
                });
            });
        }
    });
};

module.exports = subFixer;