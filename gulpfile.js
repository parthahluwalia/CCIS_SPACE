var gulp = require('gulp'),
    concat = require('gulp-concat'),
    bower = require('gulp-bower');

gulp.task('bower', function() {
  return bower();
});

gulp.task('scripts', function () {
    gulp.src([
        './bower_components/angular/angular.min.js'
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
gulp.task('default', ['styles', 'scripts']);