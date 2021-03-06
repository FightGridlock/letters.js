// api.js in /app/routes/

var express = require('express');
var router = express.Router();

var middlewares = require("../middleware/middlewares");
var keyGenerator = require("../helpers/keyGenerator");

// require the model JS file for users
var User = require('../models/user');

// middleware specific to this router
router.all("*", middlewares.timeLog);
router.post("*", middlewares.validate.user);
router.get('/', middlewares.authorize);
router.put('*', middlewares.authorize, middlewares.validate.user);
router.delete('*', middlewares.authorize);

// define the root route
router.route('/')

.get(function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.send(err);
        }

        res.json(users);

    });
})

.post(function(req, res) {

    User.find({ email: req.body.email }, function(err, users){
        if (err) {
            res.json(400, { message: "Something went wrong..." });
        }
        else {
            if (users.length > 0) {
                res.json(400, { message: "Email has already been used." });
            }
            else {
                var user = new User(); 
                user.firstName = req.body.firstName; 
                user.lastName = req.body.lastName; 
                user.email = req.body.email;
                user.address = req.body.address;
                user.ip = req.ip;
                user.sub = req.body.sub;
                
                
                if (req.body.city) {
                    user.city = req.body.city;
                }
                if (req.body.province) {
                    user.province = req.body.province;
                }
                user.postalCode = req.body.postalCode;
                user.wardId = req.body.wardId;
                
                keyGenerator(20, function(err, key) {
                    if (err) {
                        console.log(err);
                        res.json(500, { message: "Internal Server Error" });
                    }
                    else {
                        user.authKey = key;
                        // save the User and check for errors
                        user.save(function(err, user) {
                            if (err) {
                                res.json(500, {message: "Internal Server Error"});
                            }
                            else {
                                res.json({ 
                                    user: user,
                                    message: 'User Added.'
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});


router.route('/:user_id')

.get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(user);
        }
    });
})

// update the user with this ID (accessed at GET https://domain.com/api/users/:user_id)
.put(function(req, res) {

    // use the user model to find our user
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
            return;
        }
        else {
            // place params into variables
            var firstName   = req.body.firstName;
            var lastName    = req.body.lastName;
            var email       = req.body.email;
            var address     = req.body.address;
            var city        = req.body.city;
            var province    = req.body.province;
            var postalCode  = req.body.postalCode;
            var wardId      = req.body.wardId;
    
            // check if param exists, then update
            if (firstName)  { user.firstName = firstName; }
            if (lastName)   { user.lastName = lastName; }
            if (email)      { user.email = email; }
            if (address)    { user.address = address; }
            if (city)       { user.city = city; }
            if (province)   { user.province = province; }
            if (postalCode) { user.postalCode = postalCode; }
            if (wardId)     { user.wardId = wardId; }
    
            // save the user
            user.save(function(err, user) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({
                        message: "User Updated: " + user.email
                    });
                    console.log('User Updated: ' + user.email);
                }
            });
        }
    });
})

.delete(function(req, res) {

    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.send(err);
        }
        else {
            var email = user.email;
            user.remove(function(err, user) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: "Deleted User: " + email
                });
                console.log("Deleted User: " + email);
            });
        }
    });
});

router.route('/:user_email/subscribe')

.get(function(req, res) {
    User.findOne({ email: req.params.user_email}, function(err, user){
        if (err) {
            res.send(err);
        }
        else {
            if (user.sub !== true) {
                user.sub = true;
                user.save(function(err, user) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json({code: 200, message: "Subscription Updated: you are now subscribed to recieve messages from us. Thank you!"});
                    }
                });
            }
            else {
                res.json({code: 200, message: "Already Subscribed. Thank you!"});
            }
                
        }
    });
});


router.route('/:user_email/unsubscribe')

.get(function(req, res) {
    User.findOne({ email: req.params.user_email}, function(err, user){
        if (err) {
            res.send(err);
        }
        else {
            if (user.sub !== false) {
                user.sub = false;
                user.save(function(err, user) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json({code: 200, message: "Subscription Updated: you are no longer subscribed to recieve messages from us. Sorry to see you go!"});
                    }
                });
            }
            else {
                res.json({code: 200, message: "Already Unsubscribed. Please wait for up to 5 bunsiness days for our system to update."});
            }
        }
    });
});

module.exports = router;