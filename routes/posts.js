var express = require("express");
var post = require("../models/post");
var user = require("../models/user");
var router = express.Router();

router.post("/", function(req, res, next) {
  post.findAll().then(posts => {
    if (posts) {
      res.json(
        posts.filter(post => {
          return post.user_id != req.session.user_id;
        })
      );
    }
    return [];
  });
});

router.post("/add", function(req, res, next) {
  const userId = req.session.user_id;
  if (userId) {
    post
      .build({
        id: Math.floor(Math.random() * 1000000000),
        post: req.body.post,
        postHeading: req.body.postHeading,
        user_id: userId
      })
      .save()
      .then(() => {
        res.json({
          success: true,
          infoMsg: "Sharing your blog to the world."
        });
      });
  } else {
    res.json({
      success: false,
      errorMsg: "Technical Error occurred. Please login/register to continue."
    });
  }
});

router.get("/:id", function(req, res, next) {
  post.findById(req.params.id).then(post => {
    if (post) {
      res.json(post);
    }
  });
});

module.exports = router;
