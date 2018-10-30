var express = require("express");
var post = require("../models/post");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/add", function(req, res, next) {
  const userId = req.session.user_id;
  console.log(req.body.post + " " + req.session.user_id);
  if (userId) {
    post
      .build({
        id: Math.floor(Math.random() * 1000000000),
        post: req.body.post,
        user_id: userId
      })
      .save()
      .then(() => {
        res.json({
          success: true,
          infoMsg: "Happiness is shared in your community."
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
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
