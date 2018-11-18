const gulp = require('gulp');

require('./gulp-tasks/utils');
require('./gulp-tasks/css');
require('./gulp-tasks/js');
require('./gulp-tasks/markup');
require('./gulp-tasks/images');
require('./gulp-tasks/watch');


gulp.task('default', ['assemble', 'templates', 'browserSync', 'message','copyHTML', 'imagemin', 'sass', 'scripts', 'watch'], function(){

});

//logs message
gulp.task('message', function(){
    return console.log('Gulp is running...');
});