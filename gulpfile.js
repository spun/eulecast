/*jslint node: true */

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var browserSync = require("browser-sync");
var reload = browserSync.reload;

var path = {
    HTML: 'src/index.html',
    JS: ['src/js/*.js', 'src/js/**/*.js'],
    IMG: ['src/img/*.*', 'src/img/**/*.*'],
    CSS: ['src/css/*.css', 'src/css/**/*.css'],
    DEST: 'dist'
};

gulp.task('serve', ['build'], function () {
    'use strict';
    
    // Serve files from the root of this project
    browserSync({
        server: {
            baseDir: path.DEST
        }
    });

    gulp.watch(path.HTML, ['copyHTML', reload]);
    gulp.watch(path.CSS, ['copyCSS', reload]);
    gulp.watch(path.JS, ['browserify', reload]);
});


gulp.task('browserify', function () {
    'use strict';

    var bundleStream = browserify('./src/js/main.js')
        .transform(reactify)
        .bundle();

    return bundleStream
        .pipe(source('main.js'))
        .pipe(gulp.dest(path.DEST + '/js'));
});


gulp.task('copyHTML', function () {
    'use strict';

    return gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST));
});

gulp.task('copyCSS', function () {
    'use strict';

    return gulp.src(path.CSS)
        .pipe(gulp.dest(path.DEST + '/css'));
});

gulp.task('copyIMG', function () {
    'use strict';

    return gulp.src(path.IMG)
        .pipe(gulp.dest(path.DEST + '/img'));
});


gulp.task('build', ['browserify', 'copyHTML', 'copyCSS', 'copyIMG']);
gulp.task('default', ['build']);