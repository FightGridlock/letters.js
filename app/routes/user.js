// api.js in /app/routes/

var express = require('express');
var router = express.Router();

var middlewares = require("../middleware/middlewares");

// require the model JS file for users
var User = require('../models/user');
var Rep = require('../models/rep');
var Ward = require('../models/ward');

// middleware specific to this router
router.all("*", middlewares.timeLog);
router.post("*", middlewares.validateUser)
router.get('/', middlewares.authorize)
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

    var user = new User(); // create new instance of the User model
    user.firstName = req.body.firstName; // set the user's first name
    user.lastName = req.body.lastName; // set the user's last name
    user.email = req.body.email;
    user.address = req.body.address;
    if (req.body.city) {
        user.city = req.body.city;
    }
    if (req.body.province) {
        user.province = req.body.province;
    }
    user.postalCode = req.body.postalCode;
    user.wardId = req.body.wardId;

    // save the User and check for errors
    user.save(function(err) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({
                message: 'User Added.'
            });
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

module.exports = router;