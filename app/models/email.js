// app/models/user.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var EmailSchema      = new Schema({
    email: String,
    user_id: String
});

module.exports = mongoose.model('Email', EmailSchema);