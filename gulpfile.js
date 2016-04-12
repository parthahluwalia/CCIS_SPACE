var gulp = require('gulp'),
    concat = require('gulp-concat'),
    bower = require('gulp-bower');

gulp.task('bower', function() {
  return bower();
});

// Build your scripts in app.js file in ./public/js folder
gulp.task('scripts', function () {
    gulp.src([
        './public/config.js',
        './public/application.js',
        './public/modules/**/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'));

    // return gulp.src('./bower_components/')
});

gulp.task('styles', function () {
    return gulp.src([
        './public/css/foo.css',
        './bower_components/bootstrap/dist/css/*.min.css'
    ])
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./public/css'));
});

/*gulp.task('watch', function () {
    gulp.watch('');
});
*/
gulp.task('default', ['scripts']);