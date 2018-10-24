const gulp= require('gulp')
const imagemin= require('gulp-imagemin')
const uglify= require('gulp-uglify')
const scss = require('gulp-sass')
const handlebars = require('gulp-handlebars')
const wrap = require('gulp-wrap')
const declare = require('gulp-declare')
const concat = require('gulp-concat')

gulp.task('message',function(){
    return console.log("gulp is running")
}
);

gulp.task('default',function(){
    return console.log("default is running")
}
);

gulp.task('copyHTML',function(){
    gulp.src('src/*.html').pipe(gulp.dest('dist'))
}
);


gulp.task('minImage',function(){
    gulp.src('src/images/*').pipe(imagemin()).pipe(gulp.dest('dist/images'))
}
);

gulp.task('uglify',function(){
    gulp.src('src/scripts/*').pipe(uglify()).pipe(gulp.dest('dist/scripts'))
}
);

gulp.task('scss',function(){
    gulp.src('src/styles/*').pipe(scss()).pipe(gulp.dest('dist/styles'))
}
);

gulp.task('templates',function(){
    gulp.src('src/hbs-templates/*.hbs')
	.pipe(handlebars())
	.pipe(wrap('Handlebars.template(<%= contents %>)'))
	.pipe(declare({
	namespace:'MyApp.templates',
	noredeclare:true}))
	.pipe(concat('list.js'))
	.pipe(gulp.dest('src/templates/'));
}
);