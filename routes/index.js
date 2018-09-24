var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/submit', function (req, res) {
  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({ "responseCode": 1, "responseDesc": "Please select captcha" });
  }
  var secretKey = "6LcOQ14UAAAAAFJSxIgpj9346jB7-VMcKiLsqDoN";
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  request(verificationUrl, function (error, response, body) {
    body = JSON.parse(body);
    if (body.success !== undefined && !body.success) {
      res.render('index', { errorMsg: 'Failed captcha. Please try again.' });
    }
    res.json({ "responseCode": 0, "responseDesc": "Sucess" });
  });
});

module.exports = router;
