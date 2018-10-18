const gulp=require('gulp');
var imagemin=require('gulp-imagemin');
var uglify=require('gulp-uglify');
var sass=require('gulp-sass');

gulp.task('hello', function(){
    return console.log('This is a test');
});

gulp.task('default', function(){
    return console.log('This is a default');
});

gulp.task('copyHTML', function(){
    gulp.src('src/*.html')
   .pipe( gulp.dest('dist'));
});

gulp.task('imagemin', function(){
    gulp.src('src/images/*')
    .pipe(imagemin())
   .pipe( gulp.dest('dist/images'));
});

gulp.task('minify', function(){
    gulp.src('src/scripts/**/*.js')
    .pipe(uglify())
   .pipe( gulp.dest('dist/scripts'));
});

gulp.task('sass', function(){
    gulp.src('src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
   .pipe( gulp.dest('dist/css'));


});



