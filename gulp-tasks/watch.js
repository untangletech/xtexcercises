const gulp = require('gulp');

gulp.task('watch',function(){
    gulp.watch('src/*.html', ['copyHTML']);
    gulp.watch('src/images/*', ['imagemin']);
    gulp.watch('src/styles/**/*.scss', ['sass']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
});

