// app/models/rep.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var RepSchema      = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    city: { type: String, default: "Brampton" },
    province: { type: String, default: "ON" },
    postalCode: String,
    wardId: String,
    regionalRep: Boolean,
    cityRep: Boolean
});

module.exports = mongoose.model('Rep', RepSchema);