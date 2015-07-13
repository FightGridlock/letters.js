// api.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// require the model JS file for users
var User        = require('../models/user');
var Email       = require('../models/email');

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.json({
       message: "Welcome to SantaSpy API"
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
    user.fName = req.body.fName;    // set the user's first name
    user.lName = req.body.lName;    // set the user's last name
    
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
           var fName = req.body.fName; 
           var lName = req.body.lName;
           
           // check if param exists, then update
           if (fName){ user.fName = fName; } // update user info 
           if (lName){ user.lName = lName; } // update user info
           
           // save the user
           user.save(function(err, user){
              if (err){
                  res.send(err);
              } 
              res.json({
                  message: "User Updated: " + user.fName + " " + user.lName
              });
              console.log('User Updated: ' + user.fName + " " + user.lName)
           });
        });
    })
    
    .delete(function(req, res){
        
        User.findById(req.params.user_id, function(err, user){
            if (err){
                res.send(err);
            }
            var fName = user.fName;
            var lName = user.lName;
            user.remove(function(err, user){
                if (err){
                    res.send(err);
                }
                res.json({
                    message: "Deleted User: " + fName + " " + lName
                });
                console.log("Deleted User: " + fName + " " + lName)
            });
        });
    });

module.exports = router;