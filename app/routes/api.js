// api.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// Middlewares directory
var middlewares = require("../middleware/middlewares");

// require the model JS file for users
var User        = require('../models/user');
var Rep         = require('../models/rep');
var Ward        = require('../models/ward');

// middleware specific to this router
router.all("*", middlewares.timeLog);

// define the home page route
router.get('/', function(req, res) {
  res.json({
       message: "Welcome to Letters API",
       docs: "https://github.com/FightGridlock/letters.js"
   }) ;
});
module.exports = router;