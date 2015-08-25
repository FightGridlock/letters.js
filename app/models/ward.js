// app/models/ward.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var WardSchema      = new Schema({
    name: String,
    numbers: [String],
    img: String
});

module.exports = mongoose.model('Ward', WardSchema);