// emailManager.js in /app/controllers/

var async       = require('async');

// Load in required models
var User        = require('../models/user');
var Rep         = require('../models/rep');
var Ward        = require('../models/ward');
var Email       = require('../models/email');
var Template    = require('../models/template');


module.exports = {
    createEmail: function(wardId, userId, templateId, callback){
        
        // Make sure params aren't empty or null
        if ( !(wardId && userId && templateId) ) {
            console.log("createEmail() function inside emailManager module was called without correct parameters.");
            callback( { code: 1, message: "Missing or Invalid Parameters: wardId, userId, and/or templateId" } );
            return;
        }
        
        async.parallel({
                selectedWard: function(callback) {
                    Ward.findById(wardId, function(err, ward){
                        if (err){
                            console.log(err);
                            callback (err);
                        }
                        else {
                            callback(err, ward);
                        }
                    });
                },
                selectedUser: function(callback) {
                    User.findById(userId, function(err, user){
                       if (err){
                           console.log(err);
                           callback(err);
                       }
                       else {
                           callback(err, user);
                       }
                    });
                },
                selectedTemplate: function(callback) {
                    Template.findById(templateId, function(err, template) {
                        if (err) {
                            console.log(err);
                            callback(err);
                        }
                        else {
                            callback(err, template);
                        }
                    });
                },
                selectedReps: function(callback) {
                    Rep.find({ wardId: wardId}, function(err, reps){
                        if (err) {
                            console.log(err);
                            callback(err);
                        }
                        else {
                            callback(err, reps);
                        }
                    });
                }
            },
            function(err, queries) {
                if (err) {
                    callback(err);
                }
                else {
                    
                    var email = new Email();
                    
                    var to = [];
                            
                    queries.selectedReps.forEach(function(rep) {
                        to.push(rep.email);
                    });
                    
                    
                    email.replyTo = queries.selectedUser.email
                    email.body = queries.selectedTemplate.body;
                    email.subject = queries.selectedTemplate.subject;
                    email.from = "" + queries.selectedUser.firstName + " " + queries.selectedUser.lastName + " <" + queries.selectedTemplate.fromEmail + ">";
                    email.to = to;
                    email.bcc = queries.selectedTemplate.bcc;
                    email.sent = false;
                    
                    email.save(function(err, email){
                        if (err) {
                            console.log(err);
                            return err;
                        }
                        else {
                            
                        }
                    });
                    
                    callback(queries);
                }
        });
    }
};