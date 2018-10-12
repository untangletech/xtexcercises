const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
gulp.task('message',function(){
    return console.log('Gulp is running...');
});

gulp.task('imagemin',function(){
    gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    return console.log('Gulp is running...');
});

gulp.task('minify',function(){
    gulp.src('src/scripts/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
});

gulp.task('sass',)