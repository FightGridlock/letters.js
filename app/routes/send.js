// api.js in /app/routes/

var express     = require('express');
var router      = express.Router();
var nodemailer  = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'fightgridlock001@gmail.com',
        pass: 'F1ghtGr1dl0ck'
    }
});

// require the model JS files
var Email       = require('../models/email');

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


// Define the email route
router.route('/')
    
    .get(function(req, res) {
        Email.find(function(err, emails) {
            if (err){
                res.send(err)
            }
            
            res.json(emails);
        })
    });
    
router.route('/:email_id')
    
    .get(function(req, res) {
        Email.find(function(err, emails) {
            if (err){
                res.send(err)
            }
            var recipients;
            var mailOptions = {
            from: sender, // sender address
            to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
            subject: 'Hello', // Subject line
            text: 'Hello world', // plaintext body
            html: '<b>Hello world</b>' // html body
};
        })
    })
    


module.exports = router;