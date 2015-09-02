// authFix.js file in /app/helpers/

var async = require("async");

var settings = require("../settings");
var keyGenerator = require("../helpers/keyGenerator");

// User model required for fixing the user db
var User = require('../models/user');

var authFix = function(){
    
    User.find(function(err, users) {
        if (err) {
            //Nothing
        }
        else {
            users.forEach(function(user) {
                async.waterfall([
                    function(callback){
                        keyGenerator(20, function(err, key) {
                            if (err) {
                                callback(err)
                            }
                            else {
                                callback(err, key);
                            }
                        });
                    },
                    function(key, callback){
                        user.authKey = key;
                        user.verified = 100;
                        user.save(function(err, user) {
                            if (err) {
                                callback(err);
                            }
                            else {
                                callback(err, "authKey fixed for " + user.email);
                            }
                        });
                    }
                ], function(err, result){
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                    }
                });
            });
            
        }
    });
};

module.exports = authFix;