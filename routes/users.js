var express = require("express");
var user = require("../models/user");
var post = require("../models/post");
var router = express.Router();

router.get("/:id", function(req, res, next) {
  if (req.session.user_id == req.params.id) {
    user
      .findById(req.params.id, { include: [{ model: post, as: "posts" }] })
      .then(user => {
        console.log(user);
        res.render("user/wall", { email: user.email, posts: user.posts });
      });
  } else {
    req.session.infoMsg = "Please login to continue";
    res.redirect("/");
  }
});

router.get("/:id/posts", function(req, res, next) {
  user
    .findById(req.params.id, { include: [{ model: post, as: "posts" }] })
    .then(user => {
      res.json(user.posts);
    });
});

router.get("/:id/posts/:postId", function(req, res, next) {
  user
    .findById(req.params.id, { include: [{ model: post, as: "posts" }] })
    .then(user => {
      var selectedPosts = user.posts.filter(function(item) {
        return item.id == req.params.postId;
      });
      if (selectedPosts.length) {
        res.json(selectedPosts[0]);
      } else {
        res.json({ response: "No posts found" });
      }
    });
});
module.exports = router;
