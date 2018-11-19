// Gulp.js configuration
var
// modules
    gulp = require('gulp'),

    // development mode?
    devBuild = (process.env.NODE_ENV !== 'production'),

    // folders
    folder = {
        src: 'src/',
        build: 'build/'
    };

var
// modules
    gulp = require('gulp'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    htmlclean = require('gulp-htmlclean'),
    concat = require('gulp-concat'),
    deporder = require('gulp-deporder'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create();


gulp.task('message', function() {
    return console.log('Gulp is running...');
});

//image compression
gulp.task('images', function() {
    var out = folder.build + 'images/';
    return gulp.src(folder.src + 'images/*')
        .pipe(newer(out))
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(out));
});

// HTML processing
gulp.task('html', ['images'], function() {
    var
        out = folder.build + 'html/',
        page = gulp.src(folder.src + 'html/**/*')
        .pipe(newer(out));

    // minify production code
    if (!devBuild) {
        page = page.pipe(htmlclean());
    }

    return page.pipe(gulp.dest(out));
});

// JavaScript processing
gulp.task('js', function() {

    var jsbuild = gulp.src(folder.src + 'js/**/*.js')
        .pipe(deporder())
        .pipe(concat('main.js'));

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug())
            .pipe(uglify());
    }

    return jsbuild.pipe(gulp.dest(folder.build + 'js/'));

});

// CSS Copy processing
gulp.task('copyCss', function() {
    var
        out = folder.build + 'css/',
        page = gulp.src(folder.src + 'scss/**/*.css')
        .pipe(newer(out));

    return page.pipe(gulp.dest(out));
});

//index.html copying

// CSS Copy processing
gulp.task('copyIndex', function() {
    var
        out = folder.build,
        page = gulp.src(folder.src + 'index.html')
        .pipe(newer(out));

    return page.pipe(gulp.dest(out));
});

// Copy Fonts Dir processing
gulp.task('copyFonts', function() {
    var
        out = folder.build,
        page = gulp.src(folder.src + 'fonts')
        .pipe(newer(out));

    return page.pipe(gulp.dest(out));
});

// Copy Fonts Dir processing
gulp.task('copyCss', function() {
    var
        out = folder.build + 'css/',
        page = gulp.src(folder.src + 'scss/**/*')
        .pipe(newer(out));

    return page.pipe(gulp.dest(out));
});

// CSS processing
gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.css')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(folder.build + 'css/'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: folder.build
        },
    })
});

// run all tasks
gulp.task('run', ['html', 'js']);

gulp.task('watch', function() {
    gulp.watch('src/index.html', ['copyIndex']);
    gulp.watch('src/html/**/*.html', ['html']);
    gulp.watch('src/scss/**/*.css', ['copyCss']);
    gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('build', ['message', 'copyFonts', 'copyIndex', 'copyCss', 'html', 'js'], function() {

});

gulp.task('serve', ['build', 'browserSync'], function() {

});