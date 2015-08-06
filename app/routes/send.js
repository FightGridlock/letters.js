// send.js in /app/routes/

var express     = require('express');
var router      = express.Router();
var nodemailer  = require("nodemailer");
var mg          = require("nodemailer-mailgun-transport");

// Middlewares
var middlewares = require("../middleware/middlewares");

// Settings file
var settings = require("../settings")

var options = {
  auth: {
    api_key: process.env.MG_API || settings.emailService.apiKey,
    domain: process.env.MG_DOMAIN || settings.emailService.domain
  }
};

var mailer = nodemailer.createTransport(mg(options));


// require the model JS files
var Email       = require('../models/email');

// middleware specific to this router
router.all("*", middlewares.timeLog, middlewares.authorize);


// Define the root
router.route('/')
    
    .get(function(req, res) {
        Email.find(function(err, emails) {
            if (err){
                res.send(err);
            }
            
            res.json(emails);
        });
    });
    
router.route('/:email_id')
    
    .get(function(req, res) {
        Email.findById(req.params.email_id, function(err, email) {
            if (err){
                res.send(err);
            }
            else {

                var mailOptions = {
                    from: settings.emailService.user + "@" + settings.emailService.domain,
                    to: email.to,           // list of receivers
                    bcc: email.bcc,
                    subject: email.subject, // Subject line
                    text: email.body,        // plaintext body
                    'h:Reply-To': email.from
                };
                
                mailer.sendMail(mailOptions, function(err, info){
                    if (err)
                    {
                        res.send(err);
                    }
                    else {
                        email.sent = true;
                        email.save(function(err){
                           if (err){
                               res.send(err);
                           }
                           res.send(info.response);
                        });
                        res.send(info);
                    }
                });
            }
        });
    });
    


module.exports = router;