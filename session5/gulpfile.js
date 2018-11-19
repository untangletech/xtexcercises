const gulp=require("gulp");
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const wrap=require('gulp-wrap');
const declare=require('gulp-declare');
const handlebars=require('gulp-handlebars');
const assemble=require('assemble');
const htmlmin = require('gulp-htmlmin');
const extname = require('gulp-extname');


var app=assemble();



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


    gulp.task('templates',function(){
        gulp.src('hbs-templates/*.hbs')
            .pipe()
    });


    // precompile templates for front-end/runtime use
/*gulp.task('templates', function() {
    gulp.src('src/hbs-templates/*.hbs')
      .pipe(handlebars())
      .pipe(wrap('Handlebars.template(<%= contents %>)'))
      .pipe(declare({
        namespace: 'MyApp.templates',
        noRedeclare: true, // Avoid duplicate declarations
      }))
      .pipe(concat('list.js'))
      .pipe(gulp.dest('src/templates/'));
  });*/
  
  // load all dependencies to create a page
  gulp.task('load', function(cb) {
    app.partials('src/components/**/*.hbs');
    app.layouts('src/layouts/*.hbs');
    app.pages('src/pages/*.hbs');
    cb();
  });
  
  // Create/Assemble a page
  gulp.task('assemble', ['load'], function() {
    return app.toStream('pages')
      .pipe(app.renderFile())
      .pipe(htmlmin())
    .pipe(extname())
      .pipe(app.dest('dist'));
  });
  
  gulp.task('default', ['assemble','sass']);


//gulp.task('default',['browserSync','message','copyHTML', 'imagemin', 'sass', 'scripts']);