// 'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var SRC='src';
var DIST='dist';


gulp.task('js', function () {
  return gulp.src(SRC+'/scripts/**/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest(DIST+'/scripts'))
    .pipe($.size({title: 'js'}));
});
gulp.task('css', function () {
    return gulp.src(SRC+'/css/**/*.css')
      .pipe($.csso())
      .pipe(gulp.dest(DIST+'/css'))
});
gulp.task('fonts', function () {
  return gulp.src([SRC+'/fonts/**'])
    .pipe(gulp.dest(DIST+'/fonts'))
    .pipe($.size({title: 'fonts'}));
});
gulp.task('images', function () {
  return gulp.src(SRC+'/images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest(DIST+'/images'))
    .pipe($.size({title: 'images'}));
});

gulp.task('html', function () {
  return gulp.src(SRC+'/**/*.html')
    .pipe($.minify-html())
    .pipe(gulp.dest(DIST))
    .pipe($.size({title: 'html'}));
});

gulp.task('clean', function(cb) {
  del([DIST],cb);
});

gulp.task('build',function(){
  runSequence(['clean','css','js','images'])});


// Watch Files For Changes & Reload
gulp.task('serve', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: [SRC]
    }
  });

  gulp.watch([SRC+'/**'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['build'], function () {
  browserSync({
    notify: false,
    server: {
      baseDir: [DIST]
    }
  });
  gulp.watch([DIST+'/**'], reload);
});
