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
                res.json({
                    code: 401,
                    message: "Not authorized, credentials incorrect. IP logged: " + req.ip
                });
            }
        }
        else {
            console.log("Access denied to secure API, no credentials provided");
            console.log("IP logged: " + req.ip);
            res.json({
                code: 401,
                message: "Not authorized, credentials not provided. IP logged: " + req.ip
            });
        }
    },
    timeLog: function(req, res, next){
        console.log('Request - IP: ' + req.ip + ', Time: ', Date.now());
        next();
    }
};