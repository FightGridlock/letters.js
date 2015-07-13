// app/models/user.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var UserSchema      = new Schema({
    fName: String,
    lName: String
});

module.exports = mongoose.model('User', UserSchema);