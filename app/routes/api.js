// api.js in /app/routes/

var express     = require('express');
var router      = express.Router();

// Middlewares directory
var middlewares = require("../middleware/middlewares");

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