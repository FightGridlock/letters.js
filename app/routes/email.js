// email.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// Middlewares
var middlewares = require("../middleware/middlewares");
// Controllers
var emailManager = require("../controllers/emailManager")

// require the model JS files
var Email       = require('../models/email');

// middleware specific to this router
router.all("*", middlewares.timeLog);
router.delete("*", middlewares.authorize);
router.put("*", middlewares.authorize);
router.get("/", middlewares.authorize);

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
        emailManager.createEmail(req.body.wardId, req.body.userId, req.body.templateId, function(err, status){
            if (err)
            {
                res.json(err);
            }
            else {
                res.json(status);
            }
        });
    });

router.route('/:email_id')

    .get(function(req, res){
        Email.findById(req.params.email_id, function(err, email){
            if (err){
                res.send(err);
            }
            else {
                res.json(email);
            }
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
           if (email.sent)  { email.sent = false; } // Email has been changed - no longer marked as sent.
           
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