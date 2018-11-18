const gulp = require('gulp');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var extname = require('gulp-extname');
var assemble = require('assemble');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var browserSync = require('browser-sync').create();



//copy all HTML files 
gulp.task('copyHTML', function(){
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
        stream: true
     }));
});

//hbs code here -hk

var app = assemble();

// precompile templates for front-end/runtime use
gulp.task('templates', function() {
  gulp.src('src/markup/hbs-templates/*.hbs')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'MyApp.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('list.js'))
    .pipe(gulp.dest('src/markup/templates/'));
});

// load all dependencies to create a page
gulp.task('load', function(cb) {
  app.partials('src/markup/components/**/*.hbs');
  app.layouts('src/markup/layouts/*.hbs');
  app.pages('src/markup/pages/*.hbs');
  cb();
});

// Create/Assemble a page
gulp.task('assemble', ['load'], function() {
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(htmlmin())
    .pipe(extname())
    .pipe(app.dest('dist'));
});
