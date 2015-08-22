// middlewares.js in /app/middleware/

var settings = require("../settings");

module.exports = {

    authorize: function(req, res, next) {
        var auth_user = process.env.AUTH_USER || settings.apiCredentials.username;
        var auth_pass = process.env.AUTH_PASS || settings.apiCredentials.password;
        var auth = req.headers['authorization']; // auth is in base64(username:password)  so we need to decode the base64
        if (auth) {
            var tmp = auth.split(' ');
            var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
            var plain_auth = buf.toString(); // read it back out as a string
            var creds = plain_auth.split(':'); // split on a ':'
            var username = creds[0];
            var password = creds[1];
            console.log("Attempted secure API access by: " + username);
            if (username === auth_user && password === auth_pass) {
                console.log("Access granted to: " + username);
                console.log("IP Logged: " + req.ip);
                next();
            }
            else {
                console.log("Access denied to: " + username);
                console.log("IP Logged: " + req.ip);
                res.json(401, {
                    code: 401,
                    message: "Not authorized, credentials incorrect. IP logged: " + req.ip
                });
            }
        }
        else {
            console.log("Access denied to secure API, no credentials provided");
            console.log("IP logged: " + req.ip);
            res.json(401, {
                code: 401,
                message: "Not authorized, credentials not provided. IP logged: " + req.ip
            });
        }
    },
    timeLog: function(req, res, next){
        console.log('Request - IP: ' + req.ip + ', Time: ', Date.now());
        next();
    },
    validate: {
        user: function(req, res, next) {
            var method = req.route.stack[0].method;
            var errors = [];
            var warnings = 0;
            switch( method ) {
                case 'post':
                    if (!req.body.firstName) {
                        errors.push({message: "Missing firstName, required"});
                    }
                    if (!req.body.lastName) {
                        errors.push({message: "Missing lastName, required"});
                    }
                    if (!req.body.email) {
                        errors.push({message: "Missing email, required"});
                    }
                    if (!req.body.wardId) {
                        errors.push({message: "Missing wardId, required"});
                    }
                    if (errors.length > 0) {
                        res.json(400, { errors: errors });
                    }
                    else {
                        next();
                    }
                    break;
                case 'put':
                    if (!req.body.firstName)    { warnings ++; }
                    if (!req.body.lastName)     { warnings ++; }
                    if (!req.body.email)        { warnings ++; }
                    if (!req.body.address)      { warnings ++; }
                    if (!req.body.city)         { warnings ++; }
                    if (!req.body.province)     { warnings ++; }
                    if (!req.body.postalCode)   { warnings ++; }
                    if (!req.body.wardId)       { warnings ++; }
                    if (warnings === 8) {
                        res.json(400, {
                            code: 400,
                            message: "No relevant parameters sent",
                            acceptedParameters: ['firstName', 'lastName', 'email', 'address', 'city', 'province', 'postalCode', 'wardId'],
                            recievedParameters: req.body
                        });
                    }
                    else {
                        next();
                    }
                    break;
                default:
                    next();
            }
        },
        ward: function(req, res, next) {
            var method = req.route.stack[0].method;
            var errors = [];
            var warnings = 0;
            switch( method ) {
                case 'post':
                    if (!req.body.name) {
                        errors.push({message: "Missing name, required"});
                    }
                    if (!req.body.numbers) {
                        errors.push({message: "Missing numbers array, required"});
                    }
                    if (!req.body.img) {
                        errors.push({message: "Missing img, required"});
                    }
                    if (errors.length > 0) {
                        res.json(400, { errors: errors });
                    }
                    else {
                        next();
                    }
                    break;
                case 'put':
                    if (!req.body.name)     { warnings ++; }
                    if (!req.body.numbers)  { warnings ++; }
                    if (!req.body.img)      { warnings ++; }
                    if (warnings === 3) {
                        res.json(400, {
                            code: 400,
                            message: "No relevant parameters sent",
                            acceptedParameters: ['name', 'numbers', 'img'],
                            recievedParameters: req.body
                        });
                    }
                    else {
                        next();
                    }
                    break;
                default:
                    next();
            }
        },
        template: function(req, res, next) {
            var method = req.route.stack[0].method;
            var errors = [];
            var warnings = 0;
            switch( method ) {
                case 'post':
                    if (!req.body.body) {
                        errors.push({message: "Missing body, required"});
                    }
                    if (!req.body.subject) {
                        errors.push({message: "Missing subject, required"});
                    }
                    if (!req.body.fromEmail) {
                        errors.push({message: "Missing fromEmail, required"});
                    }
                    if (errors.length > 0) {
                        res.json(400, { errors: errors });
                    }
                    else {
                        next();
                    }
                    break;
                case 'put':
                    if (!req.body.body)         { warnings ++; }
                    if (!req.body.subject)      { warnings ++; }
                    if (!req.body.fromEmail)    { warnings ++; }
                    if (!req.body.cc)           { warnings ++; }
                    if (!req.body.bcc)          { warnings ++; }
                    if (!req.body.active)       { warnings ++; }
                    if (warnings === 6) {
                        res.json(400, {
                            code: 400,
                            message: "No relevant parameters sent",
                            acceptedParameters: ['body', 'subject', 'fromEmail', 'bcc', 'cc', 'active'],
                            recievedParameters: req.body
                        });
                    }
                    else {
                        next();
                    }
                    break;
                default:
                    next();
            }
        },
        rep: function(req, res, next) {
            var method = req.route.stack[0].method;
            var errors = [];
            var warnings = 0;
            switch( method ) {
                case 'post':
                    if (!req.body.firstName) {
                        errors.push({message: "Missing firstName, required"});
                    }
                    if (!req.body.lastName) {
                        errors.push({message: "Missing lastName, required"});
                    }
                    if (!req.body.email) {
                        errors.push({message: "Missing email, required"});
                    }
                    if (!req.body.wardId) {
                        errors.push({message: "Missing wardId, required"});
                    }
                    if (!req.body.regionalRep) {
                        errors.push({message: "Missing regionalRep, required"});
                    }
                    if (!req.body.cityRep) {
                        errors.push({message: "Missing cityRep, required"});
                    }
                    if (errors.length > 0) {
                        res.json(400, { errors: errors });
                    }
                    else {
                        next();
                    }
                    break;
                case 'put':
                    if (!req.body.firstName)    { warnings ++; }
                    if (!req.body.lastName)     { warnings ++; }
                    if (!req.body.email)        { warnings ++; }
                    if (!req.body.address)      { warnings ++; }
                    if (!req.body.city)         { warnings ++; }
                    if (!req.body.province)     { warnings ++; }
                    if (!req.body.postalCode)   { warnings ++; }
                    if (!req.body.wardId)       { warnings ++; }
                    // Boolean variables
                    if ( !(typeof req.body.regionalRep !== 'undefined') )   { warnings ++; }
                    if ( !(typeof req.body.cityRep !== 'undefined') )       { warnings ++; }
                    
                    if (warnings === 10) {
                        res.json(400, {
                            code: 400,
                            message: "No relevant parameters sent",
                            acceptedParameters: ['firstName', 'lastName', 'email', 'address', 'city', 'province', 'postalCode', 'wardId', 'regionalRep', 'cityRep'],
                            recievedParameters: req.body
                        });
                    }
                    else {
                        next();
                    }
                    break;
                default:
                    next();
            }
        }
    }
};