var gulp = require('gulp');
var paths = require('../paths');
var browserSync = require('browser-sync');
var livereload = require('gulp-livereload');

// outputs changes to files to the console
function reportChange(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  
}

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method. Also, by depending on the
// serve task, it will instantiate a browserSync session
gulp.task('watch', function() {
	livereload({ start: true })
  gulp.watch(paths.scss, ['build-sass']).on('change', reportChange);
  gulp.watch(paths.js, ['build-js']).on('change', reportChange);
  gulp.watch(paths.views).on('change', function(file){
  	livereload.changed(file.path);
  	reportChange(file);
  });
});
