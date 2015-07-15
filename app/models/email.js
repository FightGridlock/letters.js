// app/models/email.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var EmailSchema      = new Schema({
    from: String,
    to: [String],
    bcc: [String],
    body: String
});

module.exports = mongoose.model('Email', EmailSchema);