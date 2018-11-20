const gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var concat = require('gulp-concat');
gulp.task("message", function(){
    return console.log("Gulp is running...");
});
gulp.task("default", function(){
    return console.log("Gulp is not running...");
});
gulp.task("copyHTML", function(){
    gulp.src("src/*.html").pipe(gulp.dest("dist"));
});
gulp.task("imagemin", function(){
    gulp.src("src/images/*").pipe(imagemin()).pipe(gulp.dest("dist/images"));
});
gulp.task("uglify", function(){
    gulp.src("src/scripts/**/*.js").pipe(uglify()).pipe(gulp.dest("dist/js"));
});
gulp.task("sass", function(){
    gulp.src("src/styles/**/*.scss").pipe(sass()).on("error", sass.logError).pipe(gulp.dest("dist/css"));
});
gulp.task('scripts', function() {
	gulp.src('src/scripts/**/*.js')
	.pipe(concat('all.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/scripts'));
});
gulp.task('default',['message','copyHTML', 'imagemin', 'sass', 'scripts']);
gulp.task('watch',function(){
	gulp.watch('src/*.html', ['copyHTML']);
	gulp.watch('src/images/*', ['imagemin']);
	gulp.watch('src/styles/**/*.scss', ['sass']);
	gulp.watch('src/scripts/**/*.js', ['scripts']);
});