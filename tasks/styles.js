const gulp = require('gulp');
const postcss = require('gulp-postcss');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('cssnano');
const log = require('fancy-log');
const browserSync = require('browser-sync').create();

module.exports = () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  var plugins = [
    cssnano()
    ];
  
  return gulp.src([
    'src/scss/*.scss'
  ])
    .pipe(newer('./docs/css'))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', log.error)
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./docs/css'))
    .pipe(browserSync.stream());
  };
