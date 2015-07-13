// api.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// require the model JS file for users
var User        = require('../models/user');

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


// define the users route
router.route('/users')

    .get(function(req, res) {
      User.find(function(err, users){
            if (err){
                res.send(err)
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
    user.ward = req.body.ward;
    
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
           var ward = req.body.ward;
           
           // check if param exists, then update
           if (firstName)   { user.firstName = firstName; } // update user info 
           if (lastName)    { user.lastName = lastName; }
           if (email)       { user.email = email; }
           if (address)     { user.address = address; }
           if (city)        { user.city = city; }
           if (province)    { user.province = province; }
           if (postalCode)  { user.postalCode = postalCode; }
           if (ward)        { user.ward = ward; }
           
           // save the user
           user.save(function(err, user){
              if (err){
                  res.send(err);
              } 
              res.json({
                  message: "User Updated: " + user.email
              });
              console.log('User Updated: ' + user.email)
           });
        });
    })
    
    .delete(function(req, res){
        
        User.findById(req.params.user_id, function(err, user){
            if (err){
                res.send(err);
            }
            var firstName = user.firstName;
            var lastName = user.lastName;
            var email = user.email;
            user.remove(function(err, user){
                if (err){
                    res.send(err);
                }
                res.json({
                    message: "Deleted User: " + email
                });
                console.log("Deleted User: " + email)
            });
        });
    });

module.exports = router;