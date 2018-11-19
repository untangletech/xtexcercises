const gulp=require("gulp");
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');


gulp.task("message",function(){
	return console.log('Gulp is running...');
});

gulp.task("copyHTML",function(){
	gulp.src("doc/*.html").pipe(gulp.dest('dist'));
});

gulp.task('imagemin', function() {
        gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({
            stream: true
        }))
    });

gulp.task('minify', function() {
        gulp.src('src/scripts/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.reload({
            stream: true
        }))
    });

gulp.task('sass', function () {
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
    });
gulp.task('scripts', function() {
        gulp.src('src/scripts/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.reload({
            stream: true
        }));
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

gulp.task('default',['browserSync','message','copyHTML', 'imagemin', 'sass', 'scripts']);