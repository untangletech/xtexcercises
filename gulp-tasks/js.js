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
gulp.task('scriptsjs', function() {
    gulp.src('src/scripts/publish/**/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.reload({
        stream: true
     }));
});


gulp.task('vendorjs', function () {
    gulp.src('src/scripts/vendor/*.js')
    .pipe(gulp.dest('dist/vendor'))
    .pipe(browserSync.reload({
        stream: true
     }));
});

gulp.task('mainjs', function () {
    gulp.src('src/scripts/main.js')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
        stream: true
     }));
});


gulp.task('scripts', ['vendorjs', 'mainjs', 'scriptsjs'], function(){
    
    });
