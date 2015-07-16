// send.js in /app/routes/

var express         = require('express');
var router          = express.Router();
var nodemailer      = require("nodemailer");
var sgTransport     = require('nodemailer-sendgrid-transport');

var options = {
  auth: {
    api_user: "fightgridlock",
    api_key: "F1ghtGr1dl0ck"
  }
};

var mailer = nodemailer.createTransport(sgTransport(options));


// require the model JS files
var Email       = require('../models/email');

// middleware specific to this router
router.use(function timeLog(req, res, next) {
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
                    res.send(info);
                }
            });
        });
    });
    


module.exports = router;