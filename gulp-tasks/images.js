const gulp = require('gulp');
var imagemin = require('gulp-imagemin');

// compress images
gulp.task('imagemin', function() {
    gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
 });