var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'homepage' });
});
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'home' });
});

/* GET default view. */
router.get('/default', function(req, res, next) {
  res.render('default', { title: 'default' });
});

/* GET carousel. */
router.get('/carousel', function(req, res, next) {
  res.render('carousel', { title: 'carousel' });
});

/* GET footer. */
router.get('/footer', function(req, res, next) {
  res.render('footer', { title: 'footer' });
});
  
module.exports = router;
