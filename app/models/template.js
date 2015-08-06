// app/models/template.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var templateSchema      = new Schema({
    body:       String,
    subject:    String,
    fromEmail:  String,
    bcc:        { type: [String], default: [] },
    active:     { type: Boolean, default: true }
});

module.exports = mongoose.model('Template', templateSchema);