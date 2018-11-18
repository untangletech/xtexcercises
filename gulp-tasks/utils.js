const gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
    browserSync.init({
       server: {
          baseDir: 'dist'
       },
    })
});