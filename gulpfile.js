var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify'); // chyba sie nie przyda
var babelify = require('babelify');
var uglify = require('gulp-uglify');

gulp.task('build', () => {
	browserify('./browser.js',{ debug: true}).transform(babelify, {
		presets: ['es2015'],
		compact: true,
		global: false,
		comments: true
	}).bundle()
		.on('error', function (err) {
			console.error(err);
			this.emit('end');
		})
		.pipe(source('JsonRpc.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('./'))
		//.pipe(uglify({mangle:false,compress:false}))
		.pipe(gulp.dest('./browser'));
});

gulp.task('default', ['build']);