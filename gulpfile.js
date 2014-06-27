var gulp = require('gulp');
var browserify = require('browserify');
var envify = require('envify/custom');
var partialify = require('partialify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback');

// default task /////////////////////////////////////////////////
gulp.task('default', ['build', 'browser-sync', 'watch']);

gulp.task('clean', function() {
    return gulp.src(['build/**/*'], {
        read: false
    })
        .pipe(clean());
});



// build tasks //////////////////////////////////////////////////
gulp.task('build', ['browserify', 'css', 'html', 'images']);

gulp.task('browserify', function() {
    var environ = {
        NODE_ENV: process.env.NODE_ENV
    };
    return browserify('./app/main.js')
        .transform(envify(environ))
        .transform(partialify)
        .bundle({
            debug: process.env.NODE_ENV === 'development'
        })
        .on('error', handleErrors)
        .pipe(source('app.js'))
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({
            stream: true,
            once: true
        }));
});



// assets //////////////////////////////////////////////////////
gulp.task('html', function() {
    gulp.src('./app/**/*.html')
        .pipe(gulp.dest('build/'));
});

gulp.task('css', ['sass'], function() {
    return gulp.src('app/**/*.css')
        .pipe(autoprefixer('last 1 version'))
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('sass', function() {
    gulp.src('./app/**/*.scss')
        .pipe(autoprefixer('last 1 version'))
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('images', ['favicon'], function() {
    return gulp.src('app/img/**/*')
        .pipe(gulp.dest('build/img'));
});

gulp.task('favicon', function() {
    return gulp.src('app/img/favicon.ico')
        .pipe(gulp.dest('build/'));
});


// Static server
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./build",
            middleware: historyApiFallback
        }
    });
});


gulp.task('watch', function() {
    gulp.watch('app/**/*', ['build']);
});

// error handler ///////////////////////////////////////////////
function handleErrors() {
    // Send error to notification center with gulp-notify
    notify.onError({
        title: "Compile Error",
        message: "<%= error %>"
    })
        .apply(this, arguments);
    // Keep gulp from hanging on this task
    this.emit('end');
}