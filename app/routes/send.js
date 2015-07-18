// send.js in /app/routes/

var express     = require('express');
var router      = express.Router();
var nodemailer  = require("nodemailer");
var mg          = require("nodemailer-mailgun-transport");

var options = {
  auth: {
    api_key: process.env.MG_API || "55a73537240bfd4648000001",
    domain: process.env.MG_DOMAIN || "fightgridlock.anxgroup.com"
  }
};

var mailer = nodemailer.createTransport(mg(options));


// require the model JS files
var Email       = require('../models/email');

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
    console.log("Authorization Header is: ", auth);
    console.log('Time: ', Date.now());
  next();
});


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


            var mailOptions = {
                from: 'noreply@fightgridlock.anxgroup.com',
                to: email.to,           // list of receivers
                bcc: email.bcc,
                subject: email.subject, // Subject line
                text: email.body        // plaintext body
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
        });
    });
    


module.exports = router;