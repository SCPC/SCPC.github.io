// 'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var marked = require('marked');
var reload = browserSync.reload;
var SRC='src';
var DIST='dist';
var jade_json_name='json';
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});



gulp.task('serve', [], function () {
  browserSync({
    notify: false,
    server: {
      baseDir: ['./']
    }
  });  
  //gulp.watch(['./dist/**'], [reload]);
});
