const gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();


gulp.task('default', ['browserSync', 'message','copyHTML', 'imagemin', 'sass', 'scripts', 'watch'], function(){

});

//logs message
gulp.task('message', function(){
    return console.log('Gulp is running...');
});
//copy all HTML files 
gulp.task('copyHTML', function(){
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
        stream: true
     }));
});

// compress images
gulp.task('imagemin', function() {
    gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
 });

// minify js
gulp.task('minify', function() {
    gulp.src('src/scripts/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.reload({
        stream: true
     }));
 });

// pre compile SASS files

gulp.task('sass', function () {
    gulp.src('src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
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

gulp.task('watch',function(){
    gulp.watch('src/*.html', ['copyHTML']);
    gulp.watch('src/images/*', ['imagemin']);
    gulp.watch('src/styles/**/*.scss', ['sass']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
});

gulp.task('browserSync', function() {
    browserSync.init({
       server: {
          baseDir: 'dist'
       },
    })
});

