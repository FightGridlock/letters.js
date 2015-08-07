// template.js in /app/routes/

var express = require('express');
var router = express.Router();

// Middlewares directory
var middlewares = require("../middleware/middlewares");

// require the model JS files
var Template = require('../models/template');

// middleware specific to this router
router.all("*", middlewares.timeLog);
router.post("*", middlewares.authorize, middlewares.validate.template);
router.delete("*", middlewares.authorize);
router.put("*", middlewares.authorize, middlewares.validate.template);

// Define the template route
router.route('/')

.get(function(req, res) {
    Template.find(function(err, templates) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(templates);
        }
    });
})

.post(function(req, res) {

    var template = new Template();
    template.body = req.body.body;
    template.subject = req.body.subject;
    template.fromEmail = req.body.fromEmail;
    if (req.body.bcc) {
        template.bcc = req.body.bcc;
    }
    if (req.body.active === false || req.body.active === true) {
        template.active = req.body.active;
    }

    template.save(function(err, template) {
        if (err) {
            res.send(err);
        }
        else {
            res.json({
                message: 'Template Saved.',
                email_id: template._id
            });
        }
    });
});

router.route('/:email_id')

.get(function(req, res) {
    Template.findById(req.params.email_id, function(err, template) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(template);
        }
    });
})

// update the template with this ID (accessed at GET https://domain.com/api/template/:email_id)
.put(function(req, res) {

    // use the template model to find our template
    Template.findById(req.params.email_id, function(err, template) {
        if (err) {
            res.send(err);
        }
        else {
            // place params into variables
            var body = req.body.body;
            var fromEmail = req.body.fromEmail;
            var subject = req.body.subject;
            var bcc = req.body.bcc;
            var active = req.body.active;

            // check if param was sent, then update
            if (body) {
                template.body = body;
            }
            if (fromEmail) {
                template.from = fromEmail;
            }
            if (subject) {
                template.to = subject;
            }
            if (bcc) {
                template.bcc = bcc;
            }
            if (active) {
                template.active = active;
            }

            // save the template
            template.save(function(err, template) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({
                        message: "Template Updated: " + template._id
                    });
                    console.log('Template Updated: ' + template._id);
                }
            });
        }
    });
})

.delete(function(req, res) {

    Template.findById(req.params.email_id, function(err, template) {
        if (err) {
            res.send(err);
        }
        else {
            var email_id = req.params.email_id;
            template.remove(function(err, template) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({
                        message: "Deleted Template: " + email_id
                    });
                    console.log("Deleted Template: " + email_id);
                }
            });
        }
    });
});

module.exports = router;