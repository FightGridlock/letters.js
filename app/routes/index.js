// index.js in /app/routes/

var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Index home page');
});
// define the about route
router.get('/users', function(req, res) {
  res.send('Index Users');
});

module.exports = router;