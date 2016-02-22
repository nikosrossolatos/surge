var gulp = require('gulp');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var glob = require('glob');
var paths = require('../paths');
var livereload = require('gulp-livereload');

gulp.task('build-js', function () {
  var files = glob.sync(paths.js);
  return browserify({entries: files, extensions: ['.js'], debug: true})
      .transform('babelify', {presets: ['es2015']})
      .bundle()
      .on('error', function (err) {
          console.error(err);
          this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(paths.output))
      .pipe(livereload());
});

gulp.task('build-sass', function () {
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(changed(paths.output, {extension: '.scss'}))
    .pipe(sass())
    .pipe(gulp.dest(paths.output))
    .pipe(livereload());
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-js','build-sass'],
    callback
  );
});
