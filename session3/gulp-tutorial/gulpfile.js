const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();


gulp.task('message', function () {
    return console.log('gulp is running');
});

gulp.task('default',['browserSync','message','copyHTML', 'imagemin', 'sass', 'scripts','watch']);

gulp.task('copyHTML',function () {
    gulp.src('src/*.html').pipe(gulp.dest('dist'));
});

gulp.task('imagemin',function () {
    gulp.src('src/images/*').pipe(imagemin()).pipe(gulp.dest('dist/images'));
});

gulp.task('minify',function () {
    gulp.src('src/scripts/**/*.js').pipe(uglify()).pipe(gulp.dest('dist/scripts'));
});

gulp.task('sass', function () {
    gulp.src('src/styles/**/*.scss').pipe(sass().on('error', function () {
        sass.logError})).pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', function() {
    gulp.src('src/scripts/**/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
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