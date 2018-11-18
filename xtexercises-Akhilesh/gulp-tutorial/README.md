Gulp JS

Lab guide:

1.	Make project folder 
    Run “mkdir gulp-tutorial” 

2.	Go to folder
    cd “gulp-tutorial”

3.	Initialize node project
    Run "npm init"

4.	Enter project name, version, description etc.

5.	Install gulp globally to use it from command line
    Run "npm install –g gulp"

6.	Install gulp locally into your project 
    Run "npm install –save –dev gulp"

7.	Create new folder src
    The src folder should contain following folder structure:
    src
    |__ images (contains images which are uncompressed)
    |__ scripts (Contains multiple script files)
        |__ common.js
        |__ core.js
    |__ styles (Contains multiple SCSS files)
        |__ theme.scss
    |__ pages
    |__ layout
        |__ app.hbs (handlebars file containing page layout)
    |__ components
        |__ componentname.hbs (partial file containing components markup)
        |__ componentname.js (file containing component related javascript files)
        |__ componentname.scss (component related SASS file)
    |__ index.html 

We can modularize HTML code into smaller pieces that we can reuse across multiple HTML files.
Template engines helps to achieve modularity. With Node.js, we can now harness the power of template engines easily through the use of tools like Gulp.

using handlebars templating engine we can pull out repeated HTML markup and place them into smaller files called partials.

8. There will also be a dist folder which will be created automatically which contains the production files.
    dist
    |__ images (contains compressed images)
    |__ scripts (Single script file that contains minified codes)
    |__ styles (Single CSS file that contains minified codes)
    |__ index.html

9.	Create new file “gulpfile.js”
    It is the configuration file, which is used to define our tasks.

10.	 Add line const gulp = require(‘gulp’) to include gulp dependency.

11.	 create new task which logs a message to console

    gulp.task('message', function(){
        return console.log('Gulp is running...');
    });
    
12. go to command line 
    run "gulp message"

13. create a default task

    gulp.task('default', function(){
        return console.log('Gulp default task is running...');
    });

    go to command line 
    run "gulp"

14. create task to copy index.html to dist folder

    gulp.task('copyHTML', function(){
        gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
    });

    go to command line and run 
    "gulp copyHTML"  

15. create a task to optimize images under images folder
    refer plugin https://www.npmjs.com/package/gulp-imagemin

    run "npm install gulp-imagemin --save-dev"
    goto gulpfile.js
    add task:

    gulp.task('imagemin', function() {
        gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
    });

    in command line,
    run "gulp imagemin"

16. create task to minify JS files
    refer plugin https://www.npmjs.com/package/gulp-uglify

    run "npm install --save-dev gulp-uglify"

    in gulpfile.js 
    add "var uglify = require('gulp-uglify');"

     gulp.task('minify', function() {
        gulp.src('src/scripts/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
    });

    in command line
    run "gulp minify"

17. create task to compile SASS file to CSS
    refer plugin https://www.npmjs.com/package/gulp-sass

    run "npm install --save-dev gulp-sass"

    in gulpfile.js 
    add "var sass = require('gulp-sass');"

    gulp.task('sass', function () {
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
    });

    in command line
    run "gulp sass"

18. create task to concatenate all js files and minify them
    refer plugin https://www.npmjs.com/package/gulp-concat

    run "npm install --save-dev gulp-concat"

    in gulpfile.js 
    add "var concat = require('gulp-concat');"

    gulp.task('scripts', function() {
        gulp.src('src/scripts/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'));
    });

    in command line
    run "gulp scripts"

19. change default task to run all tasks at once 
    in gulpfile.js add
    gulp.task('default',['message','copyHTML', 'imagemin', 'sass', 'scripts']);

20. now, delete dist folder
    run "gulp" command in command line
    notice all tasks are performed at once and dist folder is created.

21. add watch task which will run gulp tasks automatically when something changes

    in gulpfile.js add following code:

    gulp.task('watch',function(){
        gulp.watch('src/*.html', ['copyHTML']);
        gulp.watch('src/images/*', ['imagemin']);
        gulp.watch('src/styles/**/*.scss', ['sass']);
        gulp.watch('src/scripts/**/*.js', ['scripts']);
    });

    in command line run
    "gulp watch"
    or add watch to default task
    gulp.task('default',['message','copyHTML', 'imagemin', 'sass', 'scripts', 'watch']);

22. add task to live reload.
    BrowserSync is used to watch all HTML and CSS files in the CSS directory and perform live reload to the page in all browsers, whenever files are changed.

    npm install browser-sync --save-dev

    in gulpfile.js add,

    gulp.task('browserSync', function() {
        browserSync.init({
        server: {
            baseDir: 'dist'
        },
        })
    });

    add following lines at the end of each task to perform live reload
        .pipe(browserSync.reload({
            stream: true
        }));

    add task 'browserSync' in default task list as shown below:
    gulp.task('default', ['browserSync', 'message','copyHTML', 'imagemin', 'sass', 'scripts', 'watch'], function(){

    });

    in command line run "gulp"
    the application will be hosted in http://localhost:3000 

    try live reloading the app by making some changes and saving it in the js files.


