var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("hbs");
var fs = require("fs");
var app = express();

var session = require("express-session");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");

process.env.EMAIL_USER = encodeURIComponent("abhinavkaul95@gmail.com");
process.env.EMAIL_PASS = "Suraj@0513";
process.env.SMTP_SERVER = "smtp.gmail.com";
process.env.DIRECT_SIGNUP = "true";

var helpers = {};
for (var helper in helpers) {
  if (helpers.hasOwnProperty(helper)) {
    hbs.registerHelper(helper, helpers[helper]);
  }
}

/*
 *  Section to register hbs partials according to the files
 *  present under the directory structure /views/partials
 */
var partialsDir = __dirname + "/views/partials";
var filenames = fs.readdirSync(partialsDir);
filenames.forEach(function(filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (matches) {
    var name = matches[1];
    var template = fs.readFileSync(partialsDir + "/" + filename, "utf8");
    hbs.registerPartial(name, template);
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "ssshhhhh", cookie: { maxAge: 3600 * 1000 } }));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
