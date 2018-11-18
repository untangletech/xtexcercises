const gulp = require('gulp');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var extname = require('gulp-extname');
var assemble = require('assemble');
var handlebars_gulp = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var browserSync = require('browser-sync').create();

//var helpers = require('handlebars-helpers')();
//var helpers = require('./helpers');

//copy all HTML files 
gulp.task('copyHTML', function(){
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
        stream: true
     }));
});

//hbs code here -hk
var site = require('./site.json');
var handlebars = require('./helpers.js');

var app = assemble();

// precompile templates for front-end/runtime use
gulp.task('templates', function() {
  gulp.src('src/templates/**/*.hbs')
    .pipe(handlebars_gulp({
      site: site,
      handlebars: handlebars
   }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'MyApp.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('helpers.js'))
    .pipe(gulp.dest('src/templates/templates/'));
});

// load all dependencies to create a page
gulp.task('load', function(cb) {
  app.partials('src/templates/partials/*.hbs');  
  app.layouts('src/templates/layouts/*.hbs');
  app.pages('src/templates/pages/*.hbs');
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

gulp.task('hbtest', ['assemble', 'templates']);