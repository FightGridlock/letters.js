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
        Rep.find(function(err, reps) {
            if (err){
                res.send(err);
            }
            
            res.json(reps);
        })
    })
    
    .post(function(req, res) {
        
        var rep = new Rep();
        rep.firstName = req.body.firstName;
        rep.lastName = req.body.lastName;
        rep.email = req.body.email;
        rep.address = req.body.address;
        if (req.body.city)          { rep.city = req.body.city; }
        if (req.body.province)      { rep.province = req.body.province; }
        rep.postalCode = req.body.postalCode;
        rep.wardId = req.body.wardId;
        rep.cityRep = req.body.cityRep;
        rep.regionalRep = req.body.regionalRep;
        
        rep.save(function(err){
           if (err){
               res.send(err);
           }
           res.json({
               message: 'Representative Added.'
           });
        });
    });

router.route('/:rep_id')

    .get(function(req, res){
        Rep.findById(req.params.rep_id, function(err, rep){
            if (err){
                res.send(err);
            }
            res.json(rep);
        });
    })
    
    // update the user with this ID (accessed at GET https://domain.com/api/reps/:user_id)
    .put(function(req, res){
        
        // use the user model to find our user
        Rep.findById(req.params.rep_id, function(err, rep){
           if (err){
               res.send(err);
           }
           // place params into variables
           var firstName = req.body.firstName; 
           var lastName = req.body.lastName;
           var email = req.body.email;
           var address = req.body.address;
           var city = req.body.city;
           var province = req.body.province;
           var postalCode = req.body.postalCode;
           var wardId = req.body.wardId;
           var regionalRep = req.body.regionalRep;
           var cityRep = req.body.cityRep;
           
           // check if param exists, then update
           if (firstName)   { rep.firstName = firstName; } // update user info 
           if (lastName)    { rep.lastName = lastName; }
           if (email)       { rep.email = email; }
           if (address)     { rep.address = address; }
           if (city)        { rep.city = city; }
           if (province)    { rep.province = province; }
           if (postalCode)  { rep.postalCode = postalCode; }
           if (wardId)      { rep.wardId = wardId; }
           if (cityRep)     { rep.cityRep = cityRep; }
           if (regionalRep) { rep.regionalRep = regionalRep; }
           
           // save the user
           rep.save(function(err, rep){
              if (err){
                  res.send(err);
              } 
              res.json({
                  message: "Representative Updated: " + rep.email
              });
              console.log('Representative Updated: ' + rep.email);
           });
        });
    })
    
    .delete(function(req, res){
        
        Rep.findById(req.params.rep_id, function(err, rep){
            if (err){
                res.send(err);
            }
            var email = rep.email;
            rep.remove(function(err, rep){
                if (err){
                    res.send(err);
                }
                res.json({
                    message: "Deleted Representative: " + email
                });
                console.log("Deleted Representative: " + email)
            });
        });
    });

module.exports = router;