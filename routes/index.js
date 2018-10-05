var express = require('express');
var request = require('request');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var user = require('../models/user');

var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
  var template = 'index', params = {};
  if (!!req.session) {
    var sess_email = req.session.email;
    var errorMsg = req.session.errorMsg;
    var infoMsg = req.session.infoMsg;
    if (!!sess_email) {
      template = 'user/index';
      params['email'] = sess_email;
    }
    if (!!errorMsg) {
      params['errorMsg'] = errorMsg;
      req.session.errorMsg = '';
    }
    if (!!infoMsg) {
      params['infoMsg'] = infoMsg;
      req.session.infoMsg = '';
    }
  }
  res.render(template, params);
});

router.get('/test/:id', function (req, res, next) {
  user.findById(req.params.id).then(function (users) {
    res.json(users);
  });
});

router.get('/logout', function (req, res, next) {
  req.session.infoMsg = 'Logged out.';
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

router.post('/signin', function (req, res) {
  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    req.session.errorMsg = 'Please select captcha';
    res.redirect("/");
  }
  var secretKey = "6LcOQ14UAAAAAFJSxIgpj9346jB7-VMcKiLsqDoN";
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  request(verificationUrl, function (error, response, body) {
    body = JSON.parse(body);
    if (body.success !== undefined && !body.success) {
      req.session.errorMsg = 'Failed captcha. Please try again.';
      res.redirect("/");
    }
    var email = req.body.email;
    var password = req.body.password;
    var hash = crypto.createHash('sha256').update(password).digest('base64');
    console.log(hash + " : ");
    user.findOne({ where: { password: hash, email: email } }).then(function (user, err) {
      console.log(err);
      if (user) {
        req.session.user_id = user.id;
        req.session.email = email;
        res.redirect("/");
      }
      if (err) {
        req.session.errorMsg = 'Please click on the link in the registered email and activate the account.';
        res.redirect("/");
      }
    });
  });
});

router.post('/signup', function (req, res) {
  var url = 'smtps://' + process.env.EMAIL_USER + ':' + process.env.EMAIL_PASS + '@' + process.env.SMTP_SERVER;
  var transporter = nodemailer.createTransport(url);
  console.log("email: " + req.body.email);
  var token = Math.floor(Math.random() * 10000);
  var mailOptions = {
    from: 'abhinavkaul95@gmail.com', // sender address
    to: req.body.email, // list of receivers
    subject: 'Test mail', // Subject line
    text: 'Hello world ?', // plaintext body
    html: '<p>Please click on <a href="http://localhost:3000/activateEmail?email=' + req.body.email + '&token=' + token + '">this link</a> to activate your email.</p>' // html body
  };
  var hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
  user.build({ name: req.body.name, email: req.body.email, birthday: req.body.birthday, password: hash, activated: 0, token: token }).save();
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
  });
  req.session.infoMsg = 'Please click on the link in the registered email and activate the account.';
  res.redirect("/");
});

router.get('/activateEmail', function (req, res) {
  var email = req.query.email;
  user.findOne({ where: { email: email, token: req.query.token, activated: 0 } }).then(function (user) {
    if (user) {
      user.updateAttributes({
        activated: 1,
        token: ''
      });
      req.session.user_id = user.id;
      req.session.email = email;
      req.session.infoMsg = 'Account activated.';
      res.redirect("/");
    }
  });
});

module.exports = router;