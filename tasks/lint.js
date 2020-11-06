const gulp = require('gulp');
const gulpIf = require('gulp-if');
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync');
 
module.exports = () => {
  return gulp.src(['src/js/**/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpIf(!browserSync.active, eslint.failAfterError()))
};
