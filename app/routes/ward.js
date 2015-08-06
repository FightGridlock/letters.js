// api.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// Middlewares directory
var middlewares = require("../middleware/middlewares");

// require the model JS file for users
var User        = require('../models/user');
var Rep         = require('../models/rep');
var Ward        = require('../models/ward');

// middleware specific to this router
router.all('*', middlewares.timeLog)
router.delete('*', middlewares.authorize);
router.put('*', middlewares.authorize, middlewares.validate.ward);
router.post('*', middlewares.authorize, middlewares.validate.ward);

// define the home page route
router.route('/')
    .get(function(req, res) {
        Ward.find(function(err, wards) {
            if (err){
                res.send(err)
            }
            else {
                res.json(wards);
            }
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
           else {
               res.json({
                   message: 'Ward Added.'
               });
            }
        });
    });



router.route('/:ward_id')

    .get(function(req, res){
        Ward.findById(req.params.ward_id, function(err, ward){
            if (err){
                res.send(err);
            }
            else {
                res.json(ward);
            }
        });
    })
    
    // update the user with this ID (accessed at GET https://domain.com/api/reps/:user_id)
    .put(function(req, res){
        
        // use the user model to find our user
        Ward.findById(req.params.ward_id, function(err, ward){
            if (err){
                res.send(err);
            }
            else {
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
                    else {
                        res.json({
                            message: "Ward Updated: " + ward.name
                        });
                        console.log('Ward Updated: ' + ward.name)
                    }
               });
            }
        });
    })
    
    .delete(function(req, res){
        
        Ward.findById(req.params.ward_id, function(err, ward){
            if (err){
                res.send(err);
            }
            else {
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
            }
        });
    });

module.exports = router;