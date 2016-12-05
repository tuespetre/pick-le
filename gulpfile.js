var gulp = require('gulp'),
	util = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    htmlmin = require('gulp-htmlmin'),
    replace = require('gulp-replace'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    //uglify = require('gulp-uglify'),
    fs = require('fs');
    
var injectRegex = /inject\(([\w\.\-\/]+)\)/g;
    
gulp.task('css', function () {
    return gulp.src('src/pick-le.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(gulp.dest('build'));
});

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('es5', ['css', 'html'], function () {
    return gulp.src('src/pick-le.js')
        .pipe(replace(injectRegex, function (found) {
            var match = injectRegex.exec(found);
            while (injectRegex.exec(found) !== null);
            return fs.readFileSync(match[1], 'utf8');
        }))
        .pipe(babel({
			presets: ['es2015']
		}))
        //.pipe(uglify().on('error', util.log))
        .pipe(rename('pick-le.es5.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('es2015', ['css', 'html'], function () {
    return gulp.src('src/pick-le.js')
        .pipe(replace(injectRegex, function (found) {
            var match = injectRegex.exec(found);
            while (injectRegex.exec(found) !== null);
            return fs.readFileSync(match[1], 'utf8');
        }))
        //.pipe(uglify().on('error', util.log))
        .pipe(rename('pick-le.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['es2015', 'es5']);

gulp.task('watch', function () {
    gulp.watch(['src/*'], ['build']);
});

gulp.task('default', ['build', 'watch']);