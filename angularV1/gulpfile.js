// 'use strict';

// var gulp = require('gulp');
// var wrench = require('wrench');

// /**
//  *  This will load all js or coffee files in the gulp directory
//  *  in order to load all gulp tasks
//  */
// wrench.readdirSyncRecursive('./gulp').filter(function(file) {
//   return (/\.(js|coffee)$/i).test(file);
// }).map(function(file) {
//   require('./gulp/' + file);
// });


// /**
//  *  Default task clean temporaries directories and launch the
//  *  main optimization build task
//  */
// gulp.task('default', ['clean'], function () {
//   gulp.start('build');
// });
////////////////New gulp Optimize Code ///////////////////
'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var wrench = require('wrench');
var minify = require('gulp-minify');
var cleanCss = require('gulp-clean-css');
//var del = require('del');

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

 gulp.task('pack-js', function () {	
	return gulp.src(['assets/js/vendor/*.js', 'assets/js/main.js', 'assets/js/module*.js'])
		.pipe(concat('bundle.js'))
		.pipe(minify())
		.pipe(gulp.dest('public/build/js'));
});
 
gulp.task('pack-css', function () {	
	return gulp.src(['assets/css/main.css', 'assets/css/custom.css'])
		.pipe(concat('stylesheet.css'))
		.pipe(cleanCss())
   .pipe(gulp.dest('public/build/css'));
});

gulp.task('watch', function() {
 gulp.watch('assets/js/**/*.js', ['pack-js']);
 gulp.watch('assets/css/**/*.css', ['pack-css']);
});

gulp.task('clean-js', function () {
	return del([
		'public/build/js/*.js'
	]);
});
 
gulp.task('clean-css', function () {
	return del([
		'public/build/css/*.css'
	]);
});

gulp.task('default', ['pack-js', 'pack-css']);


