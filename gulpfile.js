var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    inject = require('gulp-inject'),
    babel = require('gulp-babel'),
    htmlmin = require('gulp-htmlmin'),
    replace = require('gulp-replace'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    fs = require('fs');
    
var injectRegex = /inject\(([\w\.\-\/]+)\)/g;
    
gulp.task('css', function () {
    return gulp.src('src/*.scss')
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

gulp.task('js', ['css', 'html'], function () {
    return gulp.src('src/pick-le.js')
        .pipe(replace(injectRegex, function (found) {
            var match = injectRegex.exec(found);
            while (injectRegex.exec(found) !== null);
            return fs.readFileSync(match[1], 'utf8');
        }))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['js']);

gulp.task('watch', function () {
    gulp.watch(['src/*'], ['build']);
});

gulp.task('default', ['build', 'watch']);