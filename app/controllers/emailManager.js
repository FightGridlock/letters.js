// emailManager.js in /app/controllers/

var async       = require('async');

// Load in required models
var User        = require('../models/user');
var Rep         = require('../models/rep');
var Ward        = require('../models/ward');
var Email       = require('../models/email');
var Template    = require('../models/template');

var settings = require("../settings");

module.exports = {
    createEmail: function(wardId, userId, templateId, cb){
        
        // Make sure params aren't empty or null
        if ( !(wardId && userId && templateId) ) {
            console.log("createEmail() function inside emailManager module was called without correct parameters.");
            cb( { code: 500, message: "Missing or invalid parameters: wardId, userId, and/or templateId" } );
            return;
        }
        
        async.parallel({
            selectedWard: function(callback) {
                Ward.findById(wardId, function(err, ward){
                    if (err){
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
                cb(err, {
                            code: 500,
                            message: "Something went wrong when trying to search for given parameters, see err for details."
                        });
            }
            else {
                
                var email = new Email();
                
                var to = [];
                        
                queries.selectedReps.forEach(function(rep) {
                    to.push(rep.email);
                });
                
                
                email.replyTo   = queries.selectedUser.email;
                email.text      = "Dear Councillors of Wards " + queries.selectedWard.name + ",\n\n" + queries.selectedTemplate.text + "\n\nSincerely,\n" + queries.selectedUser.firstName + " " + queries.selectedUser.lastName + "\n" + queries.selectedUser.email + "\n";
                email.subject   = queries.selectedTemplate.subject;
                email.from      = "" + queries.selectedUser.firstName + " " + queries.selectedUser.lastName + " <" + settings.emailService.emailUser + "@" + settings.emailService.domain + ">";
                email.to        = to;
                email.cc        = queries.selectedTemplate.cc;
                email.bcc       = queries.selectedTemplate.bcc;
                email.sent      = false;
                email.confirmed = 100; // 100: not confirmed, 200: request sent, 300: confirmed, 400: fraudulent email
                email.userId    = queries.selectedUser._id;
                
                email.save(function(err, email){
                    if (err) {
                        cb(err, {
                            code: 500,
                            message: "Something went wrong when trying to add email to the database queue."
                        });
                    }
                    else {
                        cb(null, {
                            code: 200,
                            message: "Email queued for sending. Approximate wait time: " + settings.emailService.interval + " minute(s)."
                        });
                    }
                });
            }
        });
    }
};