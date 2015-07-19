// api.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// require the model JS file for users
var User        = require('../models/user');
var Rep         = require('../models/rep');
var Ward        = require('../models/ward');

// middleware specific to this router
router.use(function (req, res, next) {
    var auth = req.headers['authorization']; // auth is in base64(username:password)  so we need to decode the base64
    if (auth)
    {
        console.log("Authorization Header is: ", auth);
        var tmp = auth.split(' ');
        var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
        var plain_auth = buf.toString();        // read it back out as a string
        var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];
        console.log("Username: " + username);
        console.log("Password: " + password);
    } else {
        
    }
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.route('/')
    .get(function(req, res) {
        Ward.find(function(err, wards) {
            if (err){
                res.send(err)
            }
            
            res.json(wards);
        })
    })
    
    .post(function(req, res) {
        
        var ward = new Ward();
        ward.name = req.body.name;
        ward.numbers = req.body.numbers;
        
        ward.save(function(err){
           if (err){
               res.send(err);
           }
           res.json({
               message: 'Ward Added.'
           });
        });
    });



router.route('/:ward_id')

    .get(function(req, res){
        Ward.findById(req.params.ward_id, function(err, ward){
            if (err){
                res.send(err);
            }
            res.json(ward);
        });
    })
    
    // update the user with this ID (accessed at GET https://domain.com/api/reps/:user_id)
    .put(function(req, res){
        
        // use the user model to find our user
        Ward.findById(req.params.ward_id, function(err, ward){
           if (err){
               res.send(err);
           }
           // place params into variables
           var name = req.body.name; 
           var numbers = req.body.numbers;
           
           
           // check if param exists, then update
           if (name)        { ward.name = name; } // update user info 
           if (numbers)     { ward.numbers = numbers; }
           
           // save the user
           ward.save(function(err, ward){
              if (err){
                  res.send(err);
              } 
              res.json({
                  message: "Ward Updated: " + ward.name
              });
              console.log('Ward Updated: ' + ward.name)
           });
        });
    })
    
    .delete(function(req, res){
        
        Ward.findById(req.params.ward_id, function(err, ward){
            if (err){
                res.send(err);
            }
            var name = ward.name;
            ward.remove(function(err, ward){
                if (err){
                    res.send(err);
                }
                res.json({
                    message: "Deleted Ward: " + name
                });
                console.log("Deleted Ward: " + name)
            });
        });
    });

module.exports = router;