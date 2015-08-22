// app/models/email.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var EmailSchema      = new Schema({
    replyTo:    String,
    from:       String,
    to:         [String],
    cc:         { type: [String], default: [] },
    bcc:        { type: [String], default: [] },
    body:       String,
    subject:    { type: String, default: "Approve the Hurontario-Main LRT" },
    sent:       { type: Boolean, default: false }
});

module.exports = mongoose.model('Email', EmailSchema);