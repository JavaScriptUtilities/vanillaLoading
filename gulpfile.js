/* ----------------------------------------------------------
  Vars
---------------------------------------------------------- */

const gulp = require('gulp');
const del = require('del');
const {
    series
} = gulp;
const minify = require("gulp-minify");

/* ----------------------------------------------------------
  Del
---------------------------------------------------------- */

function clean() {
    return del("js/*.min.js");
}

exports.clean = clean;

/* ----------------------------------------------------------
  Minify
---------------------------------------------------------- */

function minifyjs() {
    return gulp.src('js/*.js')
        .pipe(minify({
            noSource: true,
            ext: {
                min: '.min.js'
            },
            ignoreFiles: ['*.min.js']
        }))
        .pipe(gulp.dest('js'));
}

exports.minifyjs = minifyjs;

/* ----------------------------------------------------------
  Default tasks
---------------------------------------------------------- */

exports.default = series(clean,minifyjs);
