const gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// pre compile SASS files

gulp.task('sass', function () {
    gulp.src('src/styles/publish/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
        stream: true
     }));
});

gulp.task('css', function () {
    gulp.src('src/styles/vendor/*.css')
    .pipe(gulp.dest('dist/css/vendor'))
    .pipe(browserSync.reload({
        stream: true
     }));
});