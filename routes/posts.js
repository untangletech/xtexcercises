var express = require('express');
var post = require('../models/post');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', function (req, res, next) {
  post.findById(req.params.id).then(post => {
    if (post) {
      res.json(post);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
