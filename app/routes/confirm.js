// confirm.js in /app/routes/

var express = require('express');
var router = express.Router();

// Middlewares
var middlewares = require("../middleware/middlewares");

// require the model JS files
var User = require('../models/user');

// middleware specific to this router
router.all("*", middlewares.timeLog);
router.put("*", middlewares.authorize);


// Define the email route

router.route('/:user_id/:auth')

.get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.json(400, { message: "400, Bad Request" });
        }
        else {
            if (req.params.auth === user.authKey){
                user.verified = 300; // 100: not confirmed, 200: request sent, 300: confirmed, 400: fraudulent
                user.save(function(err, user) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json({
                            message: "User Confirmed: " + user.email
                        });
                        console.log('User Confirmed: ' + user.email);
                    }
                });
            }
            else {
                res.json(401, { message: "401, Unauthorized" });
            }
        }
    });
});

/*
.delete(function(req, res) {
    
    Email.findById(req.params.email_id, function(err, email) {
        if (err) {
            res.send(err);
        }
        else {
            User.findById(email.userId, function(err, user) {
                if (err) {
                    res.send(err);
                }
                else {
                    if (req.params.auth === user.authKey){
                        email.remove(function(err, email) {
                            if (err) {
                                res.send(err);
                            }
                            else {
                                res.json({
                                    message: "Email Deleted " + email._id
                                });
                                console.log('Email Deleted: ' + email._id);
                            }
                        });
                    }
                }
            });
        }
    });
});
*/

module.exports = router;