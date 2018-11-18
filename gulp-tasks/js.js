const gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var extname = require('gulp-extname');
var browserSync = require('browser-sync').create();

// minify js
gulp.task('minify', function() {
    gulp.src('src/scripts/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.reload({
        stream: true
     }));
 });

// concatenate and uglify js files 
gulp.task('scripts', function() {
    gulp.src('src/scripts/**/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.reload({
        stream: true
     }));
});

