var async = require("async");


var keyGenerator = function(n, callback) {
    var a = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    var index; 
    var err;
    var result = "";
    
    if(n > 0) {
        err = null;
    } else {
        err = "n must be greater than 0";
    }
    
    async.series([
        function(callback) {
            while (n > 0) {
                index = (Math.random() * (a.length - 1)).toFixed(0);
                result += a[index];
                if (n == 1) {
                    callback(null, result);
                }
                n--;
            }
        }
    ], function(err, key){
        callback(err, key);
    });
};

module.exports = keyGenerator;