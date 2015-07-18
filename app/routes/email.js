// email.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// require the model JS files
var User        = require('../models/user');
var Rep         = require('../models/rep');
var Ward        = require('../models/ward');
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
    })
    
    .post(function(req, res) {
        
        var email = new Email();
        email.body = req.body.body;
        email.from = req.body.from;
        email.to = req.body.to;
        email.bcc = req.body.bcc;
        if(email.sent) { email.sent = req.body.sent; }
        
        email.save(function(err, email){
           if (err){
               res.send(err);
           }
           res.json({
               message: 'Email Saved.',
               email_id: email._id
           });
        });
    });

router.route('/:email_id')

    .get(function(req, res){
        Email.findById(req.params.email_id, function(err, email){
            if (err){
                res.send(err);
            }
            res.json(email);
        });
    })
    
    // update the email with this ID (accessed at GET https://domain.com/api/email/:email_id)
    .put(function(req, res){
        
        // use the email model to find our email
        Email.findById(req.params.email_id, function(err, email){
           if (err){
               res.send(err);
           }
            // place params into variables
            var body = req.body.body;
            var from = req.body.from;
            var to = req.body.to;
            var bcc = req.body.bcc;
            var sent = req.body.sent;
           
           // check if param exists, then update
           if (body)        { email.body = body; } // update email info 
           if (from)        { email.from = from; }
           if (to)          { email.to = to; }
           if (bcc)         { email.bcc = bcc; }
           
           // save the email
           email.save(function(err, email){
              if (err){
                  res.send(err);
              } 
              res.json({
                  message: "Email Updated: " + email._id
              });
              console.log('Email Updated: ' + email._id)
           });
        });
    })
    
    .delete(function(req, res){
        
        Email.findById(req.params.email_id, function(err, email){
            if (err){
                res.send(err);
            }
            var email_id = req.params.email_id;
            email.remove(function(err, email){
                if (err){
                    res.send(err);
                }
                res.json({
                    message: "Deleted Email: " + email_id
                });
                console.log("Deleted Email: " + email_id)
            });
        });
    });

module.exports = router;