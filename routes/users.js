var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('resume', { title: 'resum e' });
});

router.get('/add', function(req, res, next) {
  console.log("res");
  res.render('index', { title: 'homepage' });
});
module.exports = router;
