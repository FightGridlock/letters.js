// api.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// require the model JS file for users
var User        = require('../models/user');
var Rep         = require('../models/rep');
var Ward        = require('../models/ward');

// middleware specific to this router
router.use(function (req, res, next) {
    var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
    console.log("Authorization Header is: ", auth);
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
    var plain_auth = buf.toString();        // read it back out as a string
    var creds = plain_auth.split(':');      // split on a ':'
    var username = creds[0];
    var password = creds[1];
    console.log("Username: " + username);
    console.log("Password: " + password);
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/', function(req, res) {
  res.json({
       message: "Welcome to Letters API"
   }) ;
});


// define the users route
router.route('/users')

    .get(function(req, res) {
      User.find(function(err, users){
            if (err){
                res.send(err);
            }
            
            res.json(users);
            
        });
    })

    .post(function(req, res) {
        
        var user = new User();          // create new instance of the User model
        user.firstName = req.body.firstName;    // set the user's first name
        user.lastName = req.body.lastName;    // set the user's last name
        user.email = req.body.email;
        user.address = req.body.address;
        if (req.body.city) { user.city = req.body.city; }
        if (req.body.province) { user.province = req.body.province; }
        user.postalCode = req.body.postalCode;
        user.wardId = req.body.wardId;
        
        // save the User and check for errors
        user.save(function(err){
           if (err){
               res.send(err);
           }
           res.json({
               message: 'User Added.'
           });
        });
    });

router.route('/users/:user_id')
    
    .get(function(req, res){
        User.findById(req.params.user_id, function(err, user){
            if (err){
                res.send(err);
            }
            res.json(user);
        });
    })
    
    // update the user with this ID (accessed at GET https://domain.com/api/users/:user_id)
    .put(function(req, res){
        
        // use the user model to find our user
        User.findById(req.params.user_id, function(err, user){
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
           
           // check if param exists, then update
           if (firstName)   { user.firstName = firstName; } // update user info 
           if (lastName)    { user.lastName = lastName; }
           if (email)       { user.email = email; }
           if (address)     { user.address = address; }
           if (city)        { user.city = city; }
           if (province)    { user.province = province; }
           if (postalCode)  { user.postalCode = postalCode; }
           if (wardId)        { user.wardId = wardId; }
           
           // save the user
           user.save(function(err, user){
              if (err){
                  res.send(err);
              } 
              res.json({
                  message: "User Updated: " + user.email
              });
              console.log('User Updated: ' + user.email);
           });
        });
    })
    
    .delete(function(req, res){
        
        User.findById(req.params.user_id, function(err, user){
            if (err){
                res.send(err);
            }
            var email = user.email;
            user.remove(function(err, user){
                if (err){
                    res.send(err);
                }
                res.json({
                    message: "Deleted User: " + email
                });
                console.log("Deleted User: " + email);
            });
        });
    });
    
// Define the Representatives Route
router.route('/reps')
    
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

router.route('/reps/:rep_id')

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

// Define the Wards Route
router.route('/wards')
    
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

router.route('/wards/:ward_id')

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