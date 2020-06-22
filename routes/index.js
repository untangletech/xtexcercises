var express = require("express");
var request = require("request");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var user = require("../models/user");

var router = express.Router();
/* GET home page. */
router.get("/", (req, res, next) => {
  var template = "index",
    params = {};
  if (req.session) {
    var sess_email = req.session.email;
    var sess_user_id = req.session.user_id;
    if (sess_email) {
      template = "user/index";
      params["email"] = sess_email;
      params["user_id"] = sess_user_id;
    }
  }
  res.render(template, params);
});

router.get("/forms", (req, res, next) => {
  var params = {};
  if (req.session) {
    var errorMsg = req.session.errorMsg;
    var infoMsg = req.session.infoMsg;
    if (errorMsg) {
      params["errorMsg"] = errorMsg;
      req.session.errorMsg = "";
    }
    if (infoMsg) {
      params["infoMsg"] = infoMsg;
      req.session.infoMsg = "";
    }
  }
  res.render("forms", params);
});

router.get("/logout", (req, res, next) => {
  req.session.infoMsg = "Logged out.";
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect("/forms");
  });
});

router.post("/signin", (req, res) => {
  if (!req.body["g-recaptcha-response"]) {
    req.session.errorMsg = "Please select captcha";
    res.redirect("/forms");
  } else {
    var secretKey = "6LcOQ14UAAAAAFJSxIgpj9346jB7-VMcKiLsqDoN";
    var verificationUrl =
      "https://www.google.com/recaptcha/api/siteverify?secret=" +
      secretKey +
      "&response=" +
      req.body["g-recaptcha-response"] +
      "&remoteip=" +
      req.connection.remoteAddress;
    request(verificationUrl, function(error, response, body) {
      try {
        body = JSON.parse(body);
      } catch (err) {
        console.log(err);
      }
      if (body && body.success !== undefined && !body.success) {
        req.session.errorMsg = "Failed captcha. Please try again.";
        res.redirect(process.env.FORMS_URL);
      } else {
        var email = req.body.email;
        var password = req.body.password;
        var hash = crypto
          .createHash("sha256")
          .update(password)
          .digest("base64");
        user
          .findOne({ where: { password: hash, email: email } })
          .then(function(user, err) {
            if (err) {
              console.log(err);
            }
            if (user) {
              req.session.user_id = user.id;
              req.session.email = email;
              res.redirect(process.env.HOME_URL);
            } else {
              req.session.errorMsg =
                "Wrong username / password combination. Please try again.";
              res.redirect(process.env.FORMS_URL);
            }
          });
      }
    });
  }
});

router.post("/signup", (req, res) => {
  var url =
    "smtps://" +
    process.env.EMAIL_USER +
    ":" +
    process.env.EMAIL_PASS +
    "@" +
    process.env.SMTP_SERVER;
  console.log("URL: " + url);
  var id = Math.floor(Math.random() * 1000000000);
  var user_email = req.body.email;
  var hash = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");
  var activated = process.env.DIRECT_SIGNUP === "true" ? 1 : 0;
  user
    .build({
      id: id,
      name: req.body.name,
      email: user_email,
      password: hash,
      activated: activated
    })
    .save();
  user.findOne({ where: { email: user_email } }).then(function(user, err) {
    if (err) {
      console.log(err);
    }
    if (user) {
      req.session.errorMsg =
        "Email Id already exists. Please try logging in with the email id or creating new account with new one.";
      res.redirect(process.env.FORMS_URL);
    } else if (process.env.DIRECT_SIGNUP === "false") {
      console.log("Sign up using activation mail.");
      var mailOptions = {
        from: "abhinavkaul95@gmail.com",
        to: user_email,
        subject: "Activation email",
        html:
          '<p>Please click on <a href="http://localhost:3000/activateEmail?email=' +
          user_email +
          "&token=" +
          id +
          '">this link</a> to activate your email.</p>'
      };
      nodemailer
        .createTransport(url)
        .sendMail(mailOptions, function(error, info) {
          if (error) {
            return console.log(error);
          }
        });
      req.session.infoMsg =
        "Please click on the link in the registered email and activate the account.";
      res.redirect(process.env.FORMS_URL);
    } else {
      console.log("Sign up directly without activation mail.");
      req.session.user_id = id;
      req.session.email = user_email;
      res.redirect(process.env.HOME_URL);
    }
  });
});

router.get("/activateEmail", (req, res) => {
  var email = req.query.email;
  user
    .findOne({ where: { email: email, id: req.query.token, activated: 0 } })
    .then(function(user) {
      if (user) {
        user.updateAttributes({
          activated: 1
        });
        req.session.user_id = user.id;
        req.session.email = email;
        req.session.infoMsg = "Account activated.";
        res.redirect(process.env.HOME_URL);
      } else {
        req.session.errorMsg =
          "Issue while activating the email. Kindly sign up if you are not registered.";
        res.redirect(process.env.FORMS_URL);
      }
    });
});

module.exports = router;
