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
var jade_json_name='json';


gulp.task('js', function () {
  return gulp.src(SRC+'/js/**/*.js')
    .pipe($.cached('js',['optimizeMemory']))
    .pipe($.uglify())
    .pipe(gulp.dest(DIST+'/js'))
    .pipe($.size({title: 'js'}));
});
gulp.task('css', function () {
  return gulp.src(SRC+'/css/**/*.css')
    .pipe($.cached('css',['optimizeMemory']))
    .pipe($.csso())
    .pipe(gulp.dest(DIST+'/css'))
    .pipe($.size({title: 'css'}));
});
gulp.task('fonts', function () {
  return gulp.src([SRC+'/fonts/**'])
    .pipe($.cached('fonts',['optimizeMemory']))
    .pipe(gulp.dest(DIST+'/fonts'))
    .pipe($.size({title: 'fonts'}));
});
gulp.task('images', function () {
  return gulp.src(SRC+'/images/**/*')
    .pipe($.cached('images',['optimizeMemory']))
    .pipe($.imagemin())
    .pipe(gulp.dest(DIST+'/images'))
    .pipe($.size({title: 'images'}));
});
gulp.task('lib', function () {
  return gulp.src([SRC+'/lib/**'])
    .pipe(gulp.dest(DIST+'/lib'))
    .pipe($.size({title: 'lib'}));
});
gulp.task('jade_json', function () {
  $.cached.caches['jade']={};
  return gulp.src(SRC+'/jade_json/**/*.json')
    .pipe($.cached('jade_json',['optimizeMemory']))
    .pipe($.jsonminify())
    .pipe($.header('- var '+jade_json_name+'='))
    .pipe($.rename({extname:'.json.jade'}))
    .pipe(gulp.dest(SRC+'/jade_json'))
    .pipe($.size({title: 'jade_json'}));
});
gulp.task('jade_pre', function () {
  $.cached.caches['jade']={};
  return gulp.src(SRC+'/jade/**/*.jade')
    .pipe($.cached('jade_pre',['optimizeMemory']))
    .pipe($.size({title: 'jade_json'}));
});
gulp.task('jade', function () {
  return gulp.src([SRC+'/**/*.jade'])
    .pipe($.ignore.exclude(SRC+'/jade'))
    .pipe($.cached('jade',['optimizeMemory']))
    .pipe($.jade({'pretty':true}))
    .pipe(gulp.dest(DIST));
});

gulp.task('clean', function(cb) {
  del([DIST],cb);
  $.cached.caches={};
});

gulp.task('build',function(){
  runSequence(['js','css','fonts','images','lib','jade_json','jade_pre','jade'])
});


// Watch Files For Changes & Reload
// Build and serve the output from the dist build
gulp.task('serve', ['build'], function () {
  browserSync({
    notify: false,
    server: {
      baseDir: [DIST]
    }
  });
  gulp.watch([SRC+'/js'], ['js',reload]);
  gulp.watch([SRC+'/css'], ['css',reload]);
  gulp.watch([SRC+'/fonts'], ['fonts',reload]);
  gulp.watch([SRC+'/images'], ['images',reload]);
  gulp.watch([SRC+'/lib'], ['lib',reload]);
  gulp.watch([SRC+'/jade_json/**/*.json'], ['jade_json','jade',reload]);
  gulp.watch([SRC+'/jade/**/*.jade'], ['jade_pre','jade',reload]);
  gulp.watch([SRC+'/**/*.jade'], ['jade',reload]);
});
gulp.task('test', function () {
  delete $.cached.caches['jade_json'];
  gulp.watch([SRC+'/jade_json/**/*.json'], ['jade_json','jade',reload]);
});
