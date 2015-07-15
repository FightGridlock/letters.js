// api.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// require the model JS file for users
var User        = require('../models/user');
var Rep         = require('../models/rep');
var Ward        = require('../models/ward');
var Email       = require('../models/email');

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.json({
       message: "Welcome to Letters API"
   }) 
});




// Define the email route
router.route('/emails')
    
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
        
        email.save(function(err){
           if (err){
               res.send(err);
           }
           res.json({
               message: 'Email Saved.'
           });
        });
    });

router.route('/emails/:email_id')

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
           var name = req.body.name; 
           var numbers = req.body.numbers;
           
           
           // check if param exists, then update
           if (name)        { email.name = name; } // update user info 
           if (numbers)     { email.numbers = numbers; }
           
           // save the user
           email.save(function(err, email){
              if (err){
                  res.send(err);
              } 
              res.json({
                  message: "Email Updated: " + email.name
              });
              console.log('Email Updated: ' + email.name)
           });
        });
    })
    
    .delete(function(req, res){
        
        Email.findById(req.params.email_id, function(err, email){
            if (err){
                res.send(err);
            }
            var name = req.body.name;
            email.remove(function(err, rep){
                if (err){
                    res.send(err);
                }
                res.json({
                    message: "Deleted Email(s): " + name
                });
                console.log("Deleted Email(s): " + name)
            });
        });
    });

module.exports = router;