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
    wardId: String,
    sub: { type: Boolean, default: false },
    ip: String,
    authKey: { type: String, default: null },
    verified: { type: Number, default: 100 } // 100: Unverified, 200: Request Sent, 300: Verified, 400: Fraud - marked for deletion
});

module.exports = mongoose.model('User', UserSchema);