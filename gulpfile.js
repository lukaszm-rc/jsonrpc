var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify'); // chyba sie nie przyda
var babelify = require('babelify');
var uglify = require('gulp-uglify');

gulp.task('build', () => {
	browserify('./index.js', {debug: true}).transform(babelify, {
		presets: ['es2015'],
		compact: true,
		global: true,
		comments: false
	}).bundle()
		.on('error', function (err) {
			console.error(err);
			this.emit('end');
		})
		.pipe(source('browser.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['build']);