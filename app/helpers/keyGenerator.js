
var keyGenerator = function(n) {
    var a = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    var index = (Math.random() * (a.length - 1)).toFixed(0);
    return n > 0 ? a[index] + keyGenerator(n - 1, a) : '';
};

module.exports = keyGenerator;