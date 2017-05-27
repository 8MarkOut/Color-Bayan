var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

// 监控源码更改
var livereload = require('gulp-livereload');

// 动态重启服务器
var nodemon = require('gulp-nodemon');

var paths = {
    pages: ['src/*.html'],
    css: ['src/css/*.css'],
    ts: ['src/ts/*.ts'],
    js: ['src/server/*.js']
};

gulp.task("tsc", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/init.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"))
    .pipe(livereload());
});

gulp.task("copy-css", function () {
    return gulp.src(paths.css)
        .pipe(gulp.dest("dist/css"))
        .pipe(livereload());
});

gulp.task("copy-js", function () {
    return gulp.src(paths.js)
        .pipe(gulp.dest("dist/server"))
        .pipe(livereload());
});

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"))
        .pipe(livereload());
});

// 动态重启服务器
gulp.task('server', function() {
  nodemon({
    'script': 'dist/server/server.js',
    'ignore': 'dist'
  });
});

gulp.task("watch", function() {
    livereload.listen();
    gulp.watch(paths.pages, ["copy-html"]);
    gulp.watch(paths.css, ["copy-css"]);
    gulp.watch(paths.js, ["copy-js"]);
    gulp.watch(paths.ts, ["tsc"]);
});

gulp.task("default", ["copy-html", "copy-css", "copy-js", "tsc", "watch", "server"]);
