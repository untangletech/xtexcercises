var gulp = require("gulp");
var sass = require("gulp-sass");
var minifycss = require("gulp-clean-css");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var clean = require("gulp-clean");
var uglify = require("gulp-uglify");
var runSequence = require("run-sequence");
var imagemin = require("gulp-imagemin");
var spriteMaker = require("gulp.spritesmith");
gulp.task("sass2css", () => {
  return gulp
    .src("static_dev/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/stylesheets"));
});
gulp.task("concat-js", () => {
  return gulp
    .src("static_dev/js/**/*.js")
    .pipe(concat("script.js"))
    .pipe(gulp.dest("public/javascripts"));
});
gulp.task("minify-css", () => {
  return gulp
    .src(["public/stylesheets/**/*.css", "!public/javascripts/**/*.min.css"])
    .pipe(minifycss())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("public/stylesheets"));
});
gulp.task("minify-js", () => {
  return gulp
    .src(["public/javascripts/**/*.js", "!public/javascripts/**/*.min.js"])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("public/javascripts"));
});
gulp.task("clean-css", () => {
  return gulp.src("public/stylesheets", { read: false }).pipe(clean());
});
gulp.task("clean-js", () => {
  return gulp.src("public/javascripts", { read: false }).pipe(clean());
});
gulp.task("build-css", () =>
  runSequence("clean-css", "sass2css", "minify-css")
);
gulp.task("imagemin", () => {
  return gulp
    .src("static_dev/images/**/*.*")
    .pipe(imagemin())
    .pipe(gulp.dest("public/images"));
});
gulp.task("build-js", () => runSequence("clean-js", "concat-js", "minify-js"));
gulp.task("default", ["build-js", "build-css"]);
