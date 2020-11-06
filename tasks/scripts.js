const gulp = require('gulp');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
 
module.exports = () => {
  return gulp.src([
    './src/js/main.js'
  ])
    .pipe(newer('./docs/js'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./docs/js'))
};
