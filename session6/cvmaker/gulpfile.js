const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
var handlebars = require('handlebars');
var gulpHandlebars = require('gulp-handlebars-html')(handlebars);
var rename = require('gulp-rename');
var hbsAll = require('gulp-handlebars-all');


gulp.task('default',['compileToHTML', 'imagemin', 'copyfontmincss','copyfont','sass']);

gulp.task('copyHTML',function () {
    gulp.src('src/*.html').pipe(gulp.dest('dist'));
});

gulp.task('imagemin',function () {
    gulp.src('src/images/*').pipe(imagemin()).pipe(gulp.dest('dist/images'));
});

gulp.task('copyfontmincss',function () {
    gulp.src('src/styles/font-awesome.min.css').pipe(gulp.dest('dist/styles/css'));
});

gulp.task('copyfont',function () {
    gulp.src('src/styles/fonts/**/*.{eot,ttf,woff,eof,svg,otf,woff2}').pipe(gulp.dest('dist/styles/fonts'));
});

gulp.task('sass', function () {
    gulp.src('src/styles/**/*.scss').pipe(sass().on('error', function () {
        sass.logError})).pipe(gulp.dest('dist/styles/css'));
});

gulp.task('compileToHTML', function() {
    gulp.src('src/pages/index.hbs')
   .pipe(hbsAll('html', { 
     partials: ['src/components/**/*.hbs'],  
   }))
   .pipe(rename('index.html'))
   .pipe(gulp.dest('dist'));
 });


