// middlewares.js in /app/middleware/

module.exports = {

    authorize: function(req, res, next) {
        var auth_user = process.env.AUTH_USER || "fgl_user0001";
        var auth_pass = process.env.AUTH_PASS || "TESTPASS1234";
        var auth = req.headers['authorization']; // auth is in base64(username:password)  so we need to decode the base64
        if (auth) {
            var tmp = auth.split(' ');
            var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
            var plain_auth = buf.toString(); // read it back out as a string
            var creds = plain_auth.split(':'); // split on a ':'
            var username = creds[0];
            var password = creds[1];
            console.log("Attempted secure API entry by: " + username);
            if (username === auth_user && password === auth_pass) {
                console.log("Entry granted to: " + username);
                console.log("IP Logged: " + req.ip);
                next();
            }
            else {
                console.log("Entry denied to: " + username);
                console.log("IP Logged: " + req.ip);
                res.json({
                    code: 401,
                    message: "Not authorized, credentials incorrect. IP logged: " + req.ip
                });
            }
        }
        else {
            console.log("Entry denied to secure API, no credentials provided");
            console.log("IP logged: " + req.ip);
            res.json({
                code: 401,
                message: "Not authorized, credentials not provided. IP logged: " + req.ip
            });
        }
    },
    timeLog: function(req, res, next){
        console.log('IP: ' + req.ip + ', Time: ', Date.now());
        next();
    }
};