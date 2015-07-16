// index.js in /app/routes/

var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
// router.get('/', function(req, res) {
//   res.render('Index home page');
// });

module.exports = router;