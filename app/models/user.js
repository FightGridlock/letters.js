// app/models/user.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var UserSchema      = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    settings: [],
    address: String,
    city: { type: String, default: "Brampton" },
    province: { type: String, default: "ON" },
    postalCode: String,
    ward: Number
});

module.exports = mongoose.model('User', UserSchema);